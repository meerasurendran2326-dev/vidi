"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { CheckoutField } from "@/app/components/ui/CheckoutField";
import { clearCart } from "@/app/context/CartStore";
import type { CartLine } from "@/app/lib/cart-utils";
import {
  createCheckoutOrderPayload,
  getCheckoutFieldLabel,
  initialCheckoutFormValues,
  validateCheckoutField,
  validateCheckoutForm,
  type CheckoutFieldName,
  type CheckoutFormErrors,
} from "@/app/lib/checkout";

interface CheckoutFormProps {
  items: CartLine[];
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { metadata?: { payment_id?: string } };
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal: { ondismiss: () => void };
}

interface RazorpayCheckoutInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailureResponse) => void,
  ) => void;
}

type WindowWithRazorpay = Window & {
  Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
};

interface ApiErrorResponse {
  error?: string;
}

interface CreatedOrderResponse extends ApiErrorResponse {
  order?: { id: string; orderNumber: string };
}

interface RazorpayOrderResponse extends ApiErrorResponse {
  internalOrderId: string;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
}

function loadRazorpayScript(): Promise<void> {
  const razorpayWindow = window as WindowWithRazorpay;
  if (razorpayWindow.Razorpay) return Promise.resolve();

  const oldScript = document.getElementById("razorpay-checkout-script");
  oldScript?.remove();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (razorpayWindow.Razorpay) resolve();
      else reject(new Error("Razorpay Checkout could not be initialized."));
    };
    script.onerror = () => {
      script.remove();
      reject(new Error("Unable to load secure payment checkout."));
    };
    document.body.appendChild(script);
  });
}

const requiredFields: CheckoutFieldName[] = [
  "fullName",
  "email",
  "phone",
  "addressLine1",
  "city",
  "state",
  "pinCode",
  "country",
];

export function CheckoutForm({ items }: CheckoutFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialCheckoutFormValues);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<CheckoutFieldName, boolean>>
  >({});

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data?.user) {
          setValues((prev) => ({
            ...prev,
            fullName: prev.fullName || data.user.fullName || "",
            email: prev.email || data.user.email || "",
            phone: prev.phone || data.user.phone || "",
          }));
        }
      })
      .catch(() => {});
  }, []);
  const [paymentNotice, setPaymentNotice] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const handleFieldChange = (field: CheckoutFieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setPaymentNotice("");
    if (touched[field]) {
      setErrors((current) => ({
        ...current,
        [field]: validateCheckoutField(
          field,
          value,
          field === "country" ? value : values.country,
        ),
      }));
    }
    if (field === "country" && touched.pinCode) {
      setErrors((current) => ({
        ...current,
        pinCode: validateCheckoutField("pinCode", values.pinCode, value),
      }));
    }
  };

  const handleFieldBlur = (field: CheckoutFieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({
      ...current,
      [field]: validateCheckoutField(
        field,
        values[field],
        field === "country" ? values[field] : values.country,
      ),
    }));
  };

  const startPayment = async (orderId: string) => {
    const response = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const paymentOrder = (await response.json()) as RazorpayOrderResponse;
    if (!response.ok)
      throw new Error(paymentOrder.error ?? "Unable to prepare payment.");

    const razorpayWindow = window as WindowWithRazorpay;
    if (!razorpayWindow.Razorpay)
      throw new Error("Razorpay Checkout is unavailable.");

    const checkout = new razorpayWindow.Razorpay({
      key: paymentOrder.keyId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      order_id: paymentOrder.razorpayOrderId,
      name: "VINI VICI VIDI",
      description: "925 Silver Atelier order",
      prefill: {
        name: values.fullName,
        email: values.email,
        contact: values.phone,
      },
      theme: { color: "#0B4A3B" },
      handler: async (payment) => {
        setPaymentNotice("Verifying payment securely…");
        try {
          const verifyResponse = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ orderId, ...payment }),
          });
          const verification =
            (await verifyResponse.json()) as ApiErrorResponse & {
              verified?: boolean;
            };
          if (!verifyResponse.ok || !verification.verified) {
            throw new Error(
              verification.error ?? "Payment has not been confirmed yet.",
            );
          }
          clearCart();
          router.push(`/order-success/${encodeURIComponent(orderId)}`);
        } catch (error) {
          setIsStartingPayment(false);
          setPaymentNotice(
            error instanceof Error
              ? error.message
              : "Unable to verify payment.",
          );
        }
      },
      modal: {
        ondismiss: () => {
          setIsStartingPayment(false);
          setPaymentNotice(
            "Payment window closed. Your order remains pending; retry payment when ready.",
          );
        },
      },
    });

    checkout.on("payment.failed", (failure) => {
      const paymentId = failure.error?.metadata?.payment_id;
      if (paymentId) {
        void fetch("/api/payments/razorpay/failure", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId, razorpay_payment_id: paymentId }),
        });
      }
      setIsStartingPayment(false);
      setPaymentNotice(
        "Payment failed. Your order is not marked paid; you can retry securely.",
      );
    });

    checkout.open();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCheckoutForm(values);
    setErrors(nextErrors);
    setTouched(
      Object.fromEntries(requiredFields.map((field) => [field, true])),
    );
    setPaymentNotice("");

    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    if (items.length === 0) return;

    setIsStartingPayment(true);
    setPaymentNotice("Preparing secure payment…");
    try {
      await loadRazorpayScript();
      let orderId = pendingOrderId;
      if (!orderId) {
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(createCheckoutOrderPayload(values, items)),
        });
        const createdOrder =
          (await orderResponse.json()) as CreatedOrderResponse;
        if (!orderResponse.ok || !createdOrder.order?.id) {
          throw new Error(createdOrder.error ?? "Unable to create order.");
        }
        orderId = createdOrder.order.id;
        setPendingOrderId(orderId);
      }
      await startPayment(orderId);
    } catch (error) {
      setIsStartingPayment(false);
      setPaymentNotice(
        error instanceof Error ? error.message : "Unable to start payment.",
      );
    }
  };

  const invalidFields = Object.entries(errors).filter(([, message]) =>
    Boolean(message),
  ) as Array<[CheckoutFieldName, string]>;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {invalidFields.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="checkout-error-title"
          className="rounded-xl border border-rose-300/35 bg-rose-950/35 p-4 outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          <h2
            id="checkout-error-title"
            className="text-sm font-semibold text-rose-100"
          >
            Please check the highlighted fields
          </h2>
          <ul className="mt-2 space-y-1">
            {invalidFields.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#checkout-${field}`}
                  className="text-xs text-rose-200 underline underline-offset-2"
                >
                  {getCheckoutFieldLabel(field)}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
        <div className="mb-5 border-b border-white/10 pb-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Step 01
          </p>
          <h2 className="mt-1 text-base font-bold uppercase tracking-[0.14em] text-white">
            Customer Information
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <CheckoutField
            name="fullName"
            label="Full name"
            value={values.fullName}
            error={errors.fullName}
            required
            disabled={Boolean(pendingOrderId)}
            autoComplete="name"
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          <CheckoutField
            name="email"
            label="Email"
            value={values.email}
            error={errors.email}
            required
            disabled={Boolean(pendingOrderId)}
            type="email"
            inputMode="email"
            autoComplete="email"
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          <div className="sm:col-span-2">
            <CheckoutField
              name="phone"
              label="Phone number"
              value={values.phone}
              error={errors.phone}
              required
              disabled={Boolean(pendingOrderId)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Include country code if outside India"
              maxLength={24}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
        <div className="mb-5 border-b border-white/10 pb-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Step 02
          </p>
          <h2 className="mt-1 text-base font-bold uppercase tracking-[0.14em] text-white">
            Shipping Address
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CheckoutField
              name="addressLine1"
              label="Address line 1"
              value={values.addressLine1}
              error={errors.addressLine1}
              required
              disabled={Boolean(pendingOrderId)}
              autoComplete="address-line1"
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            />
          </div>
          <div className="sm:col-span-2">
            <CheckoutField
              name="addressLine2"
              label="Address line 2 / apartment / landmark"
              value={values.addressLine2}
              error={errors.addressLine2}
              disabled={Boolean(pendingOrderId)}
              autoComplete="address-line2"
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              multiline
            />
          </div>
          <CheckoutField
            name="city"
            label="City"
            value={values.city}
            error={errors.city}
            required
            disabled={Boolean(pendingOrderId)}
            autoComplete="address-level2"
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          <CheckoutField
            name="state"
            label="State"
            value={values.state}
            error={errors.state}
            required
            disabled={Boolean(pendingOrderId)}
            autoComplete="address-level1"
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          <CheckoutField
            name="pinCode"
            label="PIN code"
            value={values.pinCode}
            error={errors.pinCode}
            required
            disabled={Boolean(pendingOrderId)}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={12}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          <CheckoutField
            name="country"
            label="Country"
            value={values.country}
            error={errors.country}
            required
            disabled={Boolean(pendingOrderId)}
            autoComplete="country-name"
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-300/25 bg-emerald-900/40 text-emerald-200">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Payment
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-emerald-100/80">
              <LockKeyhole className="h-4 w-4 shrink-0 text-emerald-300" />
              Secure payment powered by Razorpay
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/50">
              Payment status changes only after server-side signature and
              provider verification.
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={items.length === 0 || isStartingPayment}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-[#1fe0bb] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#03251c] shadow-lg transition-colors hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06130e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isStartingPayment
            ? "Opening Secure Payment…"
            : pendingOrderId
              ? "Retry Payment"
              : "Continue to Payment"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className="mt-3 min-h-5 text-sm text-emerald-200/90"
        >
          {paymentNotice}
        </p>
      </section>
    </form>
  );
}
