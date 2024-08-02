"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import AuthButtonClient from "./auth-button-client";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const routes = [
    {
      href: `/${params.siteId}`,
      label: "Overview",
      active: pathname === `/${params.siteId}`,
    },
    {
      href: `/${params.siteId}/images`,
      label: "Images",
      active: pathname === `/${params.siteId}/images`,
    },
    {
      href: `/${params.siteId}/videos`,
      label: "Videos",
      active: pathname === `/${params.siteId}/videos`,
    },
    {
      href: `/${params.siteId}/music`,
      label: "Music",
      active: pathname === `/${params.siteId}/music`,
    },
    {
      href: `/${params.siteId}/pages`,
      label: "Pages",
      active: pathname === `/${params.siteId}/pages`,
    },
    {
      href: `/${params.siteId}/blog`,
      label: "Blog",
      active: pathname === `/${params.siteId}/blog`,
    },
    {
      href: `/${params.siteId}/products`,
      label: "Products",
      active: pathname === `/${params.siteId}/products`,
    },
    {
      href: `/${params.siteId}/orders`,
      label: "Orders",
      active: pathname === `/${params.siteId}/orders`,
    },
    {
      href: `/${params.siteId}/vision`,
      label: "Chat",
      active: pathname === `/${params.siteId}/vision`,
    },
    {
      href: `/${params.siteId}/settings`,
      label: "Settings",
      active: pathname === `/${params.siteId}/settings`,
    },
  ];
  const currentPage = routes.find(
    (route) =>
      pathname === route.href ||
      (pathname.startsWith(route.href) && route.href !== `/${params.siteId}`)
  );
  return (
    <div
      className={cn("flex flex-grow lg:justify-between", className)}
      {...props}
    >
      <div className="hidden lg:flex flex-grow justify-between pl-4 space-x-4">
        <div className="flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                currentPage?.href === route.href
                  ? "text-active-link"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>

        <div className="flex space-x-4 items-center">
          <div className="">
            <AuthButtonClient />
          </div>
        </div>
      </div>
      <div className="hidden ml-auto lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 hover:text-gray-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div className="ml-auto pl-1 lg:hidden">
        <AuthButtonClient />
      </div>
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 z-100 h-full bg-background shadow-md lg:hidden">
          <div
            className={`flex bg-background items-center h-screen flex-col py-2 ${
              isOpen ? "fade-in-up" : "fade-out-down"
            }`}
          >
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  currentPage?.href === route.href
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="my-3">
              <ThemeToggle />
            </div>
            <div>
              <AuthButtonClient />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
