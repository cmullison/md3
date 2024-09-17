import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTheme } from "next-themes";

const faqs = [
  {
    question: "What types of websites do you design?",
    answer:
      "I specialize in creating responsive, modern websites for businesses, portfolios, e-commerce, and more. Each project is tailored to meet the unique needs of my clients.",
  },
  {
    question: "How long does it typically take to complete a website?",
    answer:
      "Project timelines vary depending on complexity, but most websites take 4-8 weeks from start to finish. I'll provide a more accurate estimate after our initial consultation.",
  },
  {
    question: "Do you offer ongoing website maintenance?",
    answer:
      "Yes, I offer various maintenance packages to keep your website up-to-date, secure, and performing optimally. We can discuss these options once your site is complete.",
  },
  {
    question: "Can you help with content creation for my website?",
    answer:
      "While I primarily focus on design and development, I can provide guidance on content strategy and structure. For in-depth content creation, I can recommend trusted partners if needed.",
  },
  {
    question: "How do we communicate during the project?",
    answer:
      "We'll have regular check-ins via email, phone, or video calls, depending on your preference. I also use project management tools to keep you updated on progress and milestones.",
  },
  {
    question: "What if I need changes after the website is launched?",
    answer:
      "I offer a revision period after launch for minor tweaks. For larger changes or ongoing updates, we can discuss a maintenance plan or additional project scope.",
  },
  {
    question: "Do you handle website hosting and domain registration?",
    answer:
      "I can assist with setting up hosting and domains, but these are typically separate from design services. I'll guide you through the process and recommend reliable providers.",
  },
  {
    question: "How do you handle client feedback and revisions?",
    answer:
      "Feedback is crucial to the design process. I incorporate structured revision rounds into each project phase, ensuring your input is reflected in the final product.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  return (
    <section className="py-16">
      <div className="mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQItemProps {
  faq: { question: string; answer: string };
  index: number;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  theme: string | undefined;
}

function FAQItem({
  faq,
  index,
  activeIndex,
  setActiveIndex,
  theme,
}: FAQItemProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="border border-muted-foreground/20 rounded-lg overflow-hidden shadow-sm"
    >
      <motion.button
        className={`w-full text-left p-4 focus:outline-none transition-colors duration-300 ${
          activeIndex === index ? "bg-primary" : "bg-muted"
        }`}
        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
      >
        <h3 className="text-xl font-semibold text-foreground">
          {faq.question}
        </h3>
      </motion.button>
      <AnimatePresence initial={false}>
        {activeIndex === index && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="bg-background overflow-hidden"
          >
            <motion.div
              variants={{
                collapsed: { scale: 0.8 },
                open: { scale: 1 },
              }}
              transition={{ duration: 0.4 }}
              className="p-4"
            >
              <p className="text-foreground">{faq.answer}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
