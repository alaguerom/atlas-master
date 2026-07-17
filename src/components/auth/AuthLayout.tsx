import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 px-5 py-8 text-white">
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/20 bg-blue-950/25 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link
              href="/"
              aria-label="Volver al inicio de Atlas Master"
              className="rounded-[22%] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            >
              <Image
                src="/images/logo/atlas-master-logo.png"
                alt="Atlas Master"
                width={120}
                height={120}
                priority
                className="h-auto w-24 rounded-[22%] shadow-xl sm:w-28"
              />
            </Link>

            <h1 className="mt-5 text-3xl font-black sm:text-4xl">
              {title}
            </h1>

            <p className="mt-2 text-base text-blue-100 sm:text-lg">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}