import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("@/components/logo"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export const metadata: Metadata = {
  title: "Mulls Design",
  description: "UX, sound, and graphic design from Chris Mullison",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // return null; //use this if you want to keep the landing page separated
    //redirect("/login");
  }
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <ToastProvider />
        <ModalProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          themes={["light", "dark", "masters", "masters-dark", "forest"]}
        >
          <div
            className={`${
              user
                ? "hidden"
                : "flex bg-black min-h-screen flex-col items-center justify-between p-0"
            }`}
          >
            <div className="flex my-auto items-center ">
              <Logo />
            </div>
          </div>

          <div className="">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
