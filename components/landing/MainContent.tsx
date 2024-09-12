import { motion } from "framer-motion";
import ContactForm from "./ContactForm";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useRef, useEffect, useState } from "react";
import type { ISourceOptions } from "@tsparticles/engine";
import Benefits from "./Benefits";
import HowItWorks from "./HowItWorks";
import FAQ from "./FAQ";
import Footer from "./Footer"; // Add this import
import { HeroVideoDialogDemoTopInBottomOut } from "./HeroVideoDialog";
import ShimmerButton from "./ui/shimmer-button";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils"; // Add this import

// Add this items array before the MainContent function
const testimonials = [
  {
    name: "Trey Anastasio",
    title: "Lead Guitarist",
    quote: "This jam is amazing!",
  },
  {
    name: "Page McConnell",
    title: "Keyboardist",
    quote: "I love playing this every show.",
  },
  {
    name: "Mike Gordon",
    title: "Bassist",
    quote: "Game-changing for our improvisation.",
  },
  {
    name: "Jon Fishman",
    title: "Drummer",
    quote: "Boosted our musical exploration.",
  },
  {
    name: "Chris Kuroda",
    title: "Lighting Designer",
    quote: "Cannot recommend enough phans!",
  },
];

export default function MainContent() {
  const [init, setInit] = useState(false);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#7987ff",
      },
      links: {
        color: "#a2abff",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 60,
      },
      opacity: {
        value: 0.2,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
    fullScreen: {
      enable: false,
      zIndex: 0,
    },
  };

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn("mx-auto py-10 sm:py-20 text-center relative")}
      >
        <div
          ref={particlesContainerRef}
          className="absolute inset-0 overflow-hidden"
          style={{ height: "50vh" }}
        >
          {init && (
            <Particles
              id="tsparticles"
              options={particlesOptions}
              className="absolute inset-0 z-0"
            />
          )}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "text-4xl sm:text-6xl font-bold mb-4 text-center",
              "bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent"
            )}
          >
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-primary to-primary rounded-lg blur-lg opacity-65 animate-pulse"></span>
              <span
                className={`relative text-transparent bg-clip-text bg-gradient-to-b from-royal-500 to-secondary-foreground`}
              >
                Placeholder
              </span>
            </span>
            <br />
            Main Content
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              "text-lg sm:text-xl mb-8 max-w-2xl mx-auto p-6 text-center",
              "text-muted-foreground"
            )}
          >
            This is a placeholder for the main content. Replace this text with
            your actual content.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }} // Increased delay here
          >
            <CallToAction />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 px-4"
          >
            <HeroVideoDialogDemoTopInBottomOut />
          </motion.div>
          {/* Add the SocialProofMarquee component here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <InfiniteMovingCards items={testimonials} speed="normal" />
          </motion.div>
          <div className="w-full px-4">
            <Benefits />
          </div>

          {/* Add the HowItWorks component here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-full px-4"
          >
            <HowItWorks />
          </motion.div>

          {/* Add the FAQ component here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-full px-4"
          >
            <FAQ />
          </motion.div>
          <div className="w-full px-4">
            <ContactForm onSubmitSuccess={() => {}} />
          </div>
        </div>
      </motion.main>
      <Footer />
    </>
  );
}

function CallToAction() {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <ShimmerButton className="shadow-2xl">
          <span className="bg-gradient-to-t from-royal-700 via-indigo-800 to-royal-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full text-lg sm:text-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-royal-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out">
            Get started
          </span>
        </ShimmerButton>
      </motion.div>
    </div>
  );
}
