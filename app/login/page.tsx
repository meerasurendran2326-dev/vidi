import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { ShaderBackground } from "@/components/ui/adisyon-shader";
import { LoginForm } from "@/app/components/ui/LoginForm";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Client Sign In | VINI VICI VIDI Silver Atelier",
  description: "Sign in to access your VINI VICI VIDI atelier account and order history.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/account");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020704] text-slate-100">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-md flex-1 px-3.5 py-8 sm:px-6 sm:py-16">
          <section className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-[#061812]/90 p-5 sm:p-9 shadow-2xl backdrop-blur-2xl">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#1fe0bb]/10 blur-3xl pointer-events-none"
            />

            <div className="text-center mb-8">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-950/60 text-[#1fe0bb] shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#1fe0bb]">
                Atelier Client Portal
              </span>
              <h1
                className="mt-1 text-2xl sm:text-3xl font-normal text-white"
                style={{ fontFamily: "var(--font-editorial), serif" }}
              >
                Sign In
              </h1>
              <p className="mt-2 text-xs text-emerald-100/65">
                Access your commission orders, delivery tracking, and client vault.
              </p>
            </div>

            <Suspense fallback={<div className="text-center text-xs py-8 text-white/50">Loading form…</div>}>
              <LoginForm />
            </Suspense>
          </section>
        </main>

        <FooterColumn />
      </div>
    </div>
  );
}
