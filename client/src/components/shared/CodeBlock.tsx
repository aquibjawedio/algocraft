import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const customTheme = {
  ...vscDarkPlus,
  'comment': { color: '#7f848e', fontStyle: 'italic' },
  'block-comment': { color: '#7a7a7a', fontStyle: 'italic' },
  'string': { color: '#98c379' },
  'attr-value': { color: '#98c379' }, 
};

const CodeBlock = ({ code, language = "javascript" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded">
      <Button
        onClick={handleCopy}
        size="sm"
        variant="ghost"
        className="absolute right-2 top-2 text-xs cursor-pointer"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={customTheme}
        customStyle={{
          background: "#141414",
          borderRadius: "0.5rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
