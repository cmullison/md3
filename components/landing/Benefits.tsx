import { motion, useInView } from "framer-motion";
import { FiTarget, FiTrendingUp, FiSmile, FiShield } from "react-icons/fi";
import WordFadeIn from "./ui/WordFadeIn";
import { useRef } from "react";
import { useTheme } from "next-themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const { theme } = useTheme();

  return (
    <section className="py-24 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WordFadeIn
          words="Elevate Your Online Presence"
          className="mb-16 text-foreground"
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
  const { theme } = useTheme();

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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
      <Card className="relative h-full">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Icon className="w-12 h-12 text-primary flex-shrink-0 mr-6" />
          <CardTitle className="text-2xl font-bold text-foreground">
            {benefit.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={`text-muted-foreground leading-relaxed`}>
            {benefit.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="default"
            className="bg-primary/80 text-muted-secondary hover:bg-primary/90 transition-transform duration-300 hover:scale-110"
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
