import { motion } from "framer-motion";
import { Type } from "lucide-react";

interface TextInputSectionProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const TextInputSection = ({ text, onTextChange }: TextInputSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Type className="w-4 h-4 text-primary" />
        Text to Speak
      </label>
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type the text you want to hear in your cloned voice..."
          rows={4}
          className="w-full rounded-xl glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow font-sans"
        />
        <span className="absolute bottom-3 right-3 text-xs text-muted-foreground/40 font-mono">
          {text.length} chars
        </span>
      </div>
    </motion.div>
  );
};
