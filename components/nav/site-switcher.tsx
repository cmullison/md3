"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";

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
import { useSiteModal } from "@/hooks/use-site-modal";
import { useParams, useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface SiteSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
}

export default function SiteSwitcher({
  className,
  items = [],
}: SiteSwitcherProps) {
  const siteModal = useSiteModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentSite = formattedItems.find(
    (item) => item.value === params.siteId
  );

  const [open, setOpen] = React.useState(false);

  const onSiteSelect = (site: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${site.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a site"
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 h-4 w-4" />
          {currentSite?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search sites..." />
            <CommandEmpty>No site found.</CommandEmpty>
            <CommandGroup heading="Sites">
              {formattedItems.map((site) => (
                <CommandItem
                  key={site.value}
                  onSelect={() => onSiteSelect(site)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4" />
                  {site.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentSite?.value === site.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  siteModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Site
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
