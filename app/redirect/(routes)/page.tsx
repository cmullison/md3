"use client";

import { useEffect } from "react";
import { useSiteModal } from "@/hooks/use-site-modal";

const SetupPage = () => {
  const onOpen = useSiteModal((state) => state.onOpen);
  const isOpen = useSiteModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
