import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemePicker from "./ThemePicker"; // Import the ThemePicker component

export default function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  return (
    <>
      <button
        className="sm:hidden z-50 relative w-10 h-10 flex items-center justify-center"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <span className="sr-only">Open main menu</span>
        <div className="w-5 h-5 relative">
          <span
            aria-hidden="true"
            className={`block absolute h-0.5 w-5 bg-primary transform transition duration-500 ease-in-out ${
              mobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`block absolute h-0.5 w-5 bg-primary transform transition duration-500 ease-in-out ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`block absolute h-0.5 w-5 bg-primary transform transition duration-500 ease-in-out ${
              mobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
            }`}
          ></span>
        </div>
      </button>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/90 z-40 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <nav className="text-center">
              <ul className="space-y-6">
                {["Process", "Work", "Plans", "About", "FAQ"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className="text-foreground hover:text-primary text-2xl font-semibold block py-2 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
                <li onClick={(e) => e.stopPropagation()} className="pt-4">
                  <ThemePicker />
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
