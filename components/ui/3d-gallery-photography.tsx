import type React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect, Suspense, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
	fadeIn: {
		start: number;
		end: number;
	};
	fadeOut: {
		start: number;
		end: number;
	};
}

interface BlurSettings {
	blurIn: {
		start: number;
		end: number;
	};
	blurOut: {
		start: number;
		end: number;
	};
	maxBlur: number;
}

interface InfiniteGalleryProps {
	images: ImageItem[];
	speed?: number;
	zSpacing?: number;
	visibleCount?: number;
	falloff?: { near: number; far: number };
	fadeSettings?: FadeSettings;
	blurSettings?: BlurSettings;
	className?: string;
	style?: React.CSSProperties;
}

interface PlaneData {
	index: number;
	z: number;
	imageIndex: number;
	x: number;
	y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

const createClothMaterial = () => {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			map: { value: null },
			opacity: { value: 1.0 },
			blurAmount: { value: 0.0 },
			scrollForce: { value: 0.0 },
			time: { value: 0.0 },
			isHovered: { value: 0.0 },
		},
		vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        
        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
        
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }
        
        pos.z -= (curve + clothEffect + flagWave);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vec4 color = texture2D(map, vUv);
        
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
	});
};

function GalleryScene({
	images,
	speed = 1,
	visibleCount = 8,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.15 },
		fadeOut: { start: 0.85, end: 0.95 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.9, end: 1.0 },
		maxBlur: 3.0,
	},
}: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
	const { gl } = useThree();
	const scrollVelocity = useRef(0);
	const autoPlay = useRef(true);
	const lastInteraction = useRef(Date.now());
	const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	const textures = useTexture(normalizedImages.map((img) => img.src));

	const materials = useMemo(
		() => Array.from({ length: visibleCount }, () => createClothMaterial()),
		[visibleCount]
	);

	const spatialPositions = useMemo(() => {
		const positions: { x: number; y: number }[] = [];
		const maxHorizontalOffset = MAX_HORIZONTAL_OFFSET;
		const maxVerticalOffset = MAX_VERTICAL_OFFSET;

		for (let i = 0; i < visibleCount; i++) {
			const horizontalAngle = (i * 2.618) % (Math.PI * 2);
			const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);

			const horizontalRadius = (i % 3) * 1.2;
			const verticalRadius = ((i + 1) % 4) * 0.8;

			const x =
				(Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) /
				3;
			const y =
				(Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

			positions.push({ x, y });
		}

		return positions;
	}, [visibleCount]);

	const totalImages = normalizedImages.length;
	const depthRange = DEFAULT_DEPTH_RANGE;

	const planesData = useRef<PlaneData[]>(
		Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}))
	);

	useEffect(() => {
		planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z:
				visibleCount > 0
					? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange
					: 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}));
	}, [depthRange, spatialPositions, totalImages, visibleCount]);

	useEffect(() => {
		planesData.current.forEach((plane, i) => {
			const material = materials[i];
			const texture = textures[plane.imageIndex];
			if (material && texture) {
				material.uniforms.map.value = texture;
			}
		});
	}, [materials, textures]);

	const touchStartY = useRef(0);
	const touchStartX = useRef(0);

	const handleWheel = useCallback(
		(event: WheelEvent) => {
			event.preventDefault();
			scrollVelocity.current += event.deltaY * 0.01 * speed;
			autoPlay.current = false;
			lastInteraction.current = Date.now();
		},
		[speed]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
				scrollVelocity.current -= 2 * speed;
				autoPlay.current = false;
				lastInteraction.current = Date.now();
			} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
				scrollVelocity.current += 2 * speed;
				autoPlay.current = false;
				lastInteraction.current = Date.now();
			}
		},
		[speed]
	);

	const handleTouchStart = useCallback((e: TouchEvent) => {
		if (e.touches.length === 1) {
			touchStartY.current = e.touches[0].clientY;
			touchStartX.current = e.touches[0].clientX;
			autoPlay.current = false;
			lastInteraction.current = Date.now();
		}
	}, []);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (e.touches.length === 1) {
				const deltaY = touchStartY.current - e.touches[0].clientY;
				const deltaX = touchStartX.current - e.touches[0].clientX;

				// Smooth responsive response on touch swipe
				if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
					scrollVelocity.current += (deltaY * 0.035 + deltaX * 0.035) * speed;
					touchStartY.current = e.touches[0].clientY;
					touchStartX.current = e.touches[0].clientX;
					autoPlay.current = false;
					lastInteraction.current = Date.now();
				}
			}
		},
		[speed]
	);

	const handleTouchEnd = useCallback(() => {
		lastInteraction.current = Date.now();
	}, []);

	useEffect(() => {
		const canvas = gl.domElement;
		if (canvas) {
			canvas.addEventListener('wheel', handleWheel, { passive: false });
			canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
			canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
			canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
			window.addEventListener('keydown', handleKeyDown);

			return () => {
				canvas.removeEventListener('wheel', handleWheel);
				canvas.removeEventListener('touchstart', handleTouchStart);
				canvas.removeEventListener('touchmove', handleTouchMove);
				canvas.removeEventListener('touchend', handleTouchEnd);
				window.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, [gl.domElement, handleWheel, handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - lastInteraction.current > 3000) {
				autoPlay.current = true;
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useFrame((state, delta) => {
		if (autoPlay.current) {
			scrollVelocity.current += 0.3 * delta;
		}

		scrollVelocity.current *= 0.95;
		const vel = scrollVelocity.current;
		const time = state.clock.getElapsedTime();

		materials.forEach((material) => {
			if (material && material.uniforms) {
				material.uniforms.time.value = time;
				material.uniforms.scrollForce.value = vel;
			}
		});

		const imageAdvance =
			totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
		const totalRange = depthRange;

		planesData.current.forEach((plane, i) => {
			let newZ = plane.z + vel * delta * 10;
			let wrapsForward = 0;
			let wrapsBackward = 0;

			if (newZ >= totalRange) {
				wrapsForward = Math.floor(newZ / totalRange);
				newZ -= totalRange * wrapsForward;
			} else if (newZ < 0) {
				wrapsBackward = Math.ceil(-newZ / totalRange);
				newZ += totalRange * wrapsBackward;
			}

			if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
				plane.imageIndex =
					(plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
			}

			if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
				const step = plane.imageIndex - wrapsBackward * imageAdvance;
				plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
			}

			plane.z = ((newZ % totalRange) + totalRange) % totalRange;
			plane.x = spatialPositions[i]?.x ?? 0;
			plane.y = spatialPositions[i]?.y ?? 0;

			const normalizedPosition = plane.z / totalRange;
			let opacity = 1;

			if (
				normalizedPosition >= fadeSettings.fadeIn.start &&
				normalizedPosition <= fadeSettings.fadeIn.end
			) {
				const fadeInProgress =
					(normalizedPosition - fadeSettings.fadeIn.start) /
					(fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
				opacity = fadeInProgress;
			} else if (normalizedPosition < fadeSettings.fadeIn.start) {
				opacity = 0;
			} else if (
				normalizedPosition >= fadeSettings.fadeOut.start &&
				normalizedPosition <= fadeSettings.fadeOut.end
			) {
				const fadeOutProgress =
					(normalizedPosition - fadeSettings.fadeOut.start) /
					(fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
				opacity = 1 - fadeOutProgress;
			} else if (normalizedPosition > fadeSettings.fadeOut.end) {
				opacity = 0;
			}

			opacity = Math.max(0, Math.min(1, opacity));

			let blur = 0;

			if (
				normalizedPosition >= blurSettings.blurIn.start &&
				normalizedPosition <= blurSettings.blurIn.end
			) {
				const blurInProgress =
					(normalizedPosition - blurSettings.blurIn.start) /
					(blurSettings.blurIn.end - blurSettings.blurIn.start);
				blur = blurSettings.maxBlur * (1 - blurInProgress);
			} else if (normalizedPosition < blurSettings.blurIn.start) {
				blur = blurSettings.maxBlur;
			} else if (
				normalizedPosition >= blurSettings.blurOut.start &&
				normalizedPosition <= blurSettings.blurOut.end
			) {
				const blurOutProgress =
					(normalizedPosition - blurSettings.blurOut.start) /
					(blurSettings.blurOut.end - blurSettings.blurOut.start);
				blur = blurSettings.maxBlur * blurOutProgress;
			} else if (normalizedPosition > blurSettings.blurOut.end) {
				blur = blurSettings.maxBlur;
			}

			blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

			const material = materials[i];
			const texture = textures[plane.imageIndex];

			if (material && material.uniforms) {
				material.uniforms.opacity.value = opacity;
				material.uniforms.blurAmount.value = blur;
				if (texture && material.uniforms.map.value !== texture) {
					material.uniforms.map.value = texture;
				}
			}

			const mesh = meshRefs.current[i];
			if (mesh) {
				const worldZ = plane.z - depthRange / 2;
				mesh.position.set(plane.x, plane.y, worldZ);

				if (texture && texture.image) {
					const img = texture.image as any;
					const aspect = (img.width && img.height) ? img.width / img.height : 1;
					const scaleX = aspect > 1 ? 2 * aspect : 2;
					const scaleY = aspect > 1 ? 2 : 2 / aspect;
					mesh.scale.set(scaleX, scaleY, 1);
				}
			}
		});
	});

	if (normalizedImages.length === 0) return null;

	return (
		<>
			{Array.from({ length: visibleCount }).map((_, i) => {
				const material = materials[i];
				if (!material) return null;

				return (
					<mesh
						key={i}
						ref={(el) => {
							meshRefs.current[i] = el;
						}}
						material={material}
						onPointerEnter={() => {
							if (material.uniforms) material.uniforms.isHovered.value = 1.0;
						}}
						onPointerLeave={() => {
							if (material.uniforms) material.uniforms.isHovered.value = 0.0;
						}}
					>
						<planeGeometry args={[1, 1, 32, 32]} />
					</mesh>
				);
			})}
		</>
	);
}

function FallbackGallery({ images }: { images: ImageItem[] }) {
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	return (
		<div className="flex flex-col items-center justify-center h-full bg-gray-900 p-4">
			<p className="text-gray-400 mb-4 text-sm">Showing gallery:</p>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
				{normalizedImages.map((img, i) => (
					<img
						key={i}
						src={img.src}
						alt={img.alt}
						className="w-full h-32 object-cover rounded-lg"
					/>
				))}
			</div>
		</div>
	);
}

export default function InfiniteGallery({
	images,
	className = 'h-96 w-full',
	style,
	speed = 1,
	visibleCount = 8,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.25 },
		fadeOut: { start: 0.4, end: 0.43 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.4, end: 0.43 },
		maxBlur: 8.0,
	},
}: InfiniteGalleryProps) {
	const [webglSupported, setWebglSupported] = useState(true);

	useEffect(() => {
		try {
			const canvas = document.createElement('canvas');
			const gl =
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			if (!gl) {
				setWebglSupported(false);
			}
		} catch (e) {
			setWebglSupported(false);
		}
	}, []);

	if (!webglSupported) {
		return (
			<div className={className} style={style}>
				<FallbackGallery images={images} />
			</div>
		);
	}

	return (
		<div className={className} style={style}>
			<GalleryErrorBoundary fallback={<FallbackGallery images={images} />}>
				<Canvas
					camera={{ position: [0, 0, 0], fov: 55 }}
					gl={{ antialias: true, alpha: true }}
				>
					<Suspense fallback={null}>
						<GalleryScene
							images={images}
							speed={speed}
							visibleCount={visibleCount}
							fadeSettings={fadeSettings}
							blurSettings={blurSettings}
						/>
					</Suspense>
				</Canvas>
			</GalleryErrorBoundary>
		</div>
	);
}

interface ErrorBoundaryProps {
	fallback: ReactNode;
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class GalleryErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: unknown) {
		console.warn('3D Gallery fallback activated:', error);
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}
		return this.props.children;
	}
}
