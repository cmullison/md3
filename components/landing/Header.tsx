import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "./Logo";
import Navigation from "@/components/landing/Navigation";
import MobileMenu from "@/components/landing/MobileMenu";
import ThemePicker from "./ThemePicker";

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 flex justify-between items-center relative z-50"
    >
      <Logo />
      <div className="flex items-center">
        <Navigation />
        <div className="hidden pl-4 sm:block">
          <ThemePicker />
        </div>
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </div>
    </motion.header>
  );
}
