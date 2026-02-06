import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioUploadZone } from "@/components/AudioUploadZone";
import { TextInputSection } from "@/components/TextInputSection";
import { OutputPlayer } from "@/components/OutputPlayer";
import { toast } from "sonner";

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClone = async () => {
    if (!audioFile || !text.trim()) {
      toast.error("Please provide both a voice sample and text.");
      return;
    }

    setIsProcessing(true);
    setOutputUrl(null);

    // Simulate processing — replace with actual API call
    await new Promise((r) => setTimeout(r, 3000));

    // For demo purposes, play back the uploaded audio
    setOutputUrl(URL.createObjectURL(audioFile));
    setIsProcessing(false);
    toast.success("Voice cloned successfully!");
  };

  const isReady = !!audioFile && text.trim().length > 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-primary mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Voice Cloning
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground glow-text">
            Voice Cloner
          </h1>
          <p className="mt-3 text-muted-foreground text-sm max-w-sm mx-auto">
            Record or upload your voice, type any text, and hear it spoken in your cloned voice.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <AudioUploadZone audioFile={audioFile} onAudioSelect={setAudioFile} />
          <TextInputSection text={text} onTextChange={setText} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Button
              variant="glow"
              size="lg"
              onClick={handleClone}
              disabled={!isReady || isProcessing}
              className="w-full gap-2 text-base font-semibold"
            >
              <Zap className="w-4 h-4" />
              {isProcessing ? "Cloning..." : "Clone Voice"}
            </Button>
          </motion.div>

          <OutputPlayer outputUrl={outputUrl} isProcessing={isProcessing} />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground/40 mt-8"
        >
          Powered by AI · Your audio never leaves your device
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
