import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "next-themes";

const steps = [
  {
    title: "Initial Consultation",
    description:
      "We start with a friendly discussion to understand your project goals and requirements.",
  },
  {
    title: "Development Process",
    description:
      "I work diligently to bring your vision to life, providing regular updates throughout the process.",
  },
  {
    title: "Refinement and Launch",
    description:
      "We fine-tune the details and prepare for a successful launch of your project.",
  },
];

function StepCard({ step, index }: { step: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { theme } = useTheme();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50, y: 50 }}
      animate={
        isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -50, y: 50 }
      }
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`p-6 rounded-lg shadow-lg bg-white/5 border border-foreground/20 backdrop-blur-sm`}
    >
      <div className={`text-5xl font-bold mb-4 text-primary`}>{index + 1}</div>
      <h3 className={`text-2xl font-semibold mb-2 text-foreground`}>
        {step.title}
      </h3>
      <p className="text-muted-foreground">{step.description}</p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { theme } = useTheme();

  return (
    <section className="mb-12 relative">
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-bold mb-12 text-center text-foreground`}>
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
