import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutputPlayerProps {
  outputUrl: string | null;
  isProcessing: boolean;
}

const ProcessingAnimation = () => (
  <div className="flex items-center justify-center gap-1 py-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-2 rounded-full bg-primary"
        animate={{ height: [8, 28, 8] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export const OutputPlayer = ({ outputUrl, isProcessing }: OutputPlayerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-primary" />
        Cloned Output
      </label>

      <div className="glass rounded-xl p-5 min-h-[100px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-3"
            >
              <ProcessingAnimation />
              <p className="text-sm text-muted-foreground">Cloning your voice...</p>
            </motion.div>
          ) : outputUrl ? (
            <motion.div
              key="output"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-3"
            >
              <audio
                src={outputUrl}
                controls
                className="w-full h-10 [&::-webkit-media-controls-panel]:bg-secondary [&::-webkit-media-controls-panel]:rounded-lg"
              />
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" asChild className="gap-2 text-primary">
                  <a href={outputUrl} download="cloned-voice.wav">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground/50 text-center"
            >
              Your cloned voice will appear here
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
