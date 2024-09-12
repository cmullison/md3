import { motion } from "framer-motion";
import Link from "next/link";

export default function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="hidden sm:block"
    >
      <ul className="flex space-x-6">
        {["Process", "Work", "Plans", "About", "FAQ"].map((item) => (
          <li key={item} className="mx-2 my-1">
            <Link
              href={`#${item.toLowerCase()}`}
              className="text-foreground hover:text-primary"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
