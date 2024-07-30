"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams, useRouter, usePathname } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface PageSwitcherProps extends PopoverTriggerProps {
  className?: string;
}

export default function PageSwitcher({ className }: PageSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    { href: `/${params.siteId}`, label: "Overview" },
    { href: `/${params.siteId}/images`, label: "Images" },
    { href: `/${params.siteId}/videos`, label: "Videos" },
    { href: `/${params.siteId}/music`, label: "Music" },
    { href: `/${params.siteId}/pages`, label: "Pages" },
    { href: `/${params.siteId}/blog`, label: "Blog" },
    { href: `/${params.siteId}/products`, label: "Products" },
    { href: `/${params.siteId}/orders`, label: "Orders" },
    { href: `/${params.siteId}/chat`, label: "Chat" },
    { href: `/${params.siteId}/settings`, label: "Settings" },
  ];

  const currentPage = routes.find(
    (route) =>
      pathname === route.href ||
      (pathname.startsWith(route.href) && route.href !== `/${params.siteId}`)
  );

  const [open, setOpen] = React.useState(false);

  const onPageSelect = (page: { href: string; label: string }) => {
    setOpen(false);
    router.push(page.href);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a page"
          className={cn("w-[200px] justify-between", className)}
        >
          {currentPage?.label || "Select page"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search pages..." />
            <CommandEmpty>No page found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {routes.map((page) => (
                <CommandItem
                  key={page.href}
                  onSelect={() => onPageSelect(page)}
                  className="text-sm"
                >
                  {page.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentPage?.href === page.href
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
