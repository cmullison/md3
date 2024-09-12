import { useTheme } from "next-themes";
import HeroVideoDialog from "./ui/hero-video-dialog";

export function HeroVideoDialogDemoTopInBottomOut() {
  const { resolvedTheme } = useTheme();

  const thumbnailSrc =
    resolvedTheme === "dark"
      ? "https://startup-template-sage.vercel.app/hero-dark.png"
      : "https://startup-template-sage.vercel.app/hero-light.png";

  return (
    <div className="relative">
      <HeroVideoDialog
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc={thumbnailSrc}
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
