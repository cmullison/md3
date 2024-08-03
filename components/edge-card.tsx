import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

const EdgeFunctionsCard: React.FC = () => {
  return (
    <Card className="w-80 h-96 bg-zinc-900 text-white overflow-hidden relative">
      <CardContent className="flex flex-col items-center justify-start h-full pt-12">
        <div className="bg-zinc-800 p-3 rounded-xl mb-6">
          <Globe className="w-8 h-8 text-zinc-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Edge Functions</h2>
        <p className="text-zinc-400 text-center mb-8">
          Easily write custom code
          <br />
          without deploying or scaling servers.
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="w-full h-1/2 border-t border-l border-r border-emerald-500/50 rounded-tl-full rounded-tr-full" />
            </div>
            <div
              className="absolute inset-0 flex items-end justify-center"
              style={{ transform: "rotate(-15deg)" }}
            >
              <div className="w-full h-1/2 border-t border-l border-r border-emerald-500/30 rounded-tl-full rounded-tr-full" />
            </div>
            <div
              className="absolute inset-0 flex items-end justify-center"
              style={{ transform: "rotate(15deg)" }}
            >
              <div className="w-full h-1/2 border-t border-l border-r border-emerald-500/30 rounded-tl-full rounded-tr-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EdgeFunctionsCard;
