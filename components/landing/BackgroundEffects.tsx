import { useTheme } from "next-themes";

export default function BackgroundEffects() {
  const { theme } = useTheme();

  return (
    <>
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-secondary/10"></div>

      {/* Subtle animated glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full filter blur-3xl animate-pulse bg-primary/30"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full filter blur-3xl animate-pulse bg-secondary/30"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Refined static elements with variations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gradient-radial from-primary/10 to-transparent"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-radial from-secondary/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-accent/10 to-transparent"></div>

        {/* New elements */}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-gradient-radial from-purple-300/10 to-transparent"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-gradient-radial from-teal-200/10 to-transparent"></div>
        <div className="absolute top-3/4 right-1/3 w-48 h-48 rounded-full bg-gradient-radial from-pink-200/10 to-transparent"></div>
        <div className="absolute top-1/4 left-2/3 w-40 h-40 rounded-full bg-gradient-radial from-yellow-200/5 to-transparent"></div>
        <div className="absolute bottom-1/3 right-1/2 w-60 h-60 rounded-full bg-gradient-radial from-green-300/10 to-transparent"></div>
      </div>

      {/* Modern grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-noise"></div>
    </>
  );
}
