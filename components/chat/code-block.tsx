import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import hljs from "highlight.js";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const highlightedCode = hljs.highlight(code, { language }).value;

  return (
    <Card className="w-full my-4 overflow-hidden">
      <div className="flex justify-between items-center bg-muted py-2 px-4">
        {language && (
          <div className="text-muted-foreground text-sm font-mono">
            {language}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <CardContent className="p-0">
        <pre className="overflow-x-auto p-4">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </CardContent>
    </Card>
  );
};

export default CodeBlock;
