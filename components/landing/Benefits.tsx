import { motion, useInView } from "framer-motion";
import { FiTarget, FiTrendingUp, FiSmile, FiShield } from "react-icons/fi";
import WordFadeIn from "./ui/WordFadeIn";
import { useRef } from "react";
import { useTheme } from "next-themes"; // Add this import

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: FiTarget,
    title: "Stand Out from the Crowd",
    description:
      "Captivate your audience with a unique, eye-catching design that sets you apart from competitors.",
  },
  {
    icon: FiTrendingUp,
    title: "Boost Your Online Presence",
    description:
      "Skyrocket your visibility and attract more clients with a website optimized for search engines and conversions.",
  },
  {
    icon: FiSmile,
    title: "Delight Your Visitors",
    description:
      "Create an unforgettable user experience that keeps visitors coming back and turns them into loyal customers.",
  },
  {
    icon: FiShield,
    title: "Future-Proof Your Business",
    description:
      "Stay ahead of the curve with a cutting-edge website that adapts to evolving technologies and user expectations.",
  },
];

export default function Benefits() {
  const { theme } = useTheme(); // Add this line

  return (
    <section className="py-24 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WordFadeIn
          words="Elevate Your Online Presence"
          className={`mb-16 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`} // Update this line
          delay={0.2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const Icon = benefit.icon;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const { theme } = useTheme(); // Add this line

  const slideDirection = index % 2 === 0 ? -100 : 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: slideDirection }}
      animate={
        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: slideDirection }
      }
      transition={{ duration: 0.8 }}
      className="relative group h-full"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-royal-600 to-royal-400 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
      <div
        className={`relative ${
          theme === "dark" ? "bg-black bg-opacity-70" : "bg-white"
        } rounded-lg p-8 ring-1 ring-gray-900/5 shadow-lg h-full flex flex-col`}
      >
        <div className="flex items-center space-x-6 mb-6">
          <Icon className="w-12 h-12 text-royal-400 flex-shrink-0" />
          <h3
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {benefit.title}
          </h3>
        </div>
        <p
          className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          } leading-relaxed flex-grow`}
        >
          {benefit.description}
        </p>
        <div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-royal-500 text-white rounded-md font-semibold text-sm transition-colors duration-300 hover:bg-royal-600"
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
