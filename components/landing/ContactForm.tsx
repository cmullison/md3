import { useState, useEffect, SetStateAction } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import FlipText from "./ui/flip-text";
import { useTheme } from "next-themes";

interface ContactFormProps {
  onSubmitSuccess: () => void;
}

export default function ContactForm({ onSubmitSuccess }: ContactFormProps) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccessMessage(true);
    setName("");
    setEmail("");
    setMessage("");
    onSubmitSuccess();
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  return (
    <>
      <h2>
        <FlipText
          className="text-4xl font-bold mb-12 text-center tracking-[-0.1em] text-foreground"
          word="Ready to get started?"
        />
      </h2>
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-md mx-auto"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-card p-8 rounded-2xl shadow-lg backdrop-blur-md relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(to right, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1))",
                "linear-gradient(to right, hsl(var(--secondary) / 0.1), hsl(var(--primary) / 0.1))",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(135deg, 
                hsl(var(--foreground) / 0.05) 0%, 
                hsl(var(--foreground) / 0.025) 25%, 
                hsl(var(--foreground) / 0.05) 50%, 
                hsl(var(--foreground) / 0.025) 75%, 
                hsl(var(--foreground) / 0.05) 100%
              ),
              radial-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "400% 400%, 20px 20px",
              animation: "moveGradient 15s ease infinite",
            }}
          />

          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Get in Touch
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              We&#39;d love to hear from you!
            </p>

            <InputField
              label="Name"
              type="text"
              value={name}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setName(e.target.value)
              }
              required
            />

            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setEmail(e.target.value)
              }
              required
            />

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-left mb-2 text-foreground"
              >
                Message
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border-input text-foreground placeholder-muted-foreground border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none h-32"
                placeholder="Your message"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300"
            >
              {isSubmitting ? <LoadingSpinner /> : "Send Message"}
            </motion.button>
          </div>
        </form>

        <AnimatePresence>
          {showSuccessMessage && (
            <SuccessMessage onClose={() => setShowSuccessMessage(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

const InputField = ({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
  [key: string]: any;
}) => (
  <div className="mb-6">
    <label htmlFor={props.id} className="block text-left mb-2 text-foreground">
      {label}
    </label>
    <motion.input
      whileFocus={{ scale: 1.02 }}
      className="w-full px-4 py-2 bg-background border-input text-foreground placeholder-muted-foreground border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
      {...props}
    />
    {error && <p className="mt-1 text-destructive text-sm">{error}</p>}
  </div>
);

const SuccessMessage = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="mt-4 p-4 bg-accent text-accent-foreground rounded-md flex items-center justify-between"
  >
    <span>Message sent successfully!</span>
    <button
      onClick={onClose}
      className="text-accent-foreground hover:text-muted-foreground"
    >
      ✕
    </button>
  </motion.div>
);

const LoadingSpinner = () => (
  <span className="flex items-center justify-center">
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Submitting...
  </span>
);

<style jsx global>{`
  @keyframes moveGradient {
    0% {
      background-position: 0% 0%, 0 0;
    }
    50% {
      background-position: 100% 100%, 0 0;
    }
    100% {
      background-position: 0% 0%, 0 0;
    }
  }
`}</style>;
