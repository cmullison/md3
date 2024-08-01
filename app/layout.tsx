import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mulls Design",
  description: "UX, sound, and graphic design from Chris Mullison",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
      <body className={inter.className}>
        <div
          className={`${
            user
              ? "hidden"
              : "flex bg-black min-h-screen flex-col items-center justify-between p-24"
          }`}
        >
          <div className="flex place-items-center ">
            <Image
              className=""
              src="/logo-1.png"
              alt="Mulls logo"
              width={360}
              height={75}
              priority
            />
          </div>
        </div>

        <div className="">
          <ToastProvider />
          <ModalProvider />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            themes={["light", "dark", "masters", "masters-dark", "forest"]}
          >
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
