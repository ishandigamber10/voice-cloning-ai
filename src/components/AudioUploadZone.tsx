import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, X, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioUploadZoneProps {
  onAudioSelect: (file: File | null) => void;
  audioFile: File | null;
}

const WaveformBars = () => (
  <div className="flex items-center gap-[3px] h-8">
    {Array.from({ length: 24 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full bg-primary/60"
        animate={{ height: ["20%", `${30 + Math.random() * 60}%`, "20%"] }}
        transition={{
          duration: 0.8 + Math.random() * 0.6,
          repeat: Infinity,
          delay: i * 0.05,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export const AudioUploadZone = ({ onAudioSelect, audioFile }: AudioUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("audio/")) onAudioSelect(file);
    },
    [onAudioSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAudioSelect(file);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        onAudioSelect(file);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      console.error("Microphone access denied");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <AudioLines className="w-4 h-4 text-primary" />
        Voice Input
      </label>

      <AnimatePresence mode="wait">
        {audioFile ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-xl p-5 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{audioFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(audioFile.size / 1024).toFixed(1)} KB
              </p>
              <audio
                src={URL.createObjectURL(audioFile)}
                controls
                className="mt-3 w-full h-8 [&::-webkit-media-controls-panel]:bg-secondary [&::-webkit-media-controls-panel]:rounded-lg"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAudioSelect(null)}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer rounded-xl border-2 border-dashed p-8
                flex flex-col items-center gap-4 transition-all duration-300
                ${isDragging
                  ? "border-primary bg-primary/5 glow-border"
                  : "border-border hover:border-primary/50 hover:bg-card/50"
                }
              `}
            >
              {isRecording ? (
                <WaveformBars />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 text-primary" />
                </motion.div>
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isRecording ? "Recording..." : "Drop audio file here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRecording ? "Click stop when done" : "or click to browse"}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex justify-center mt-3">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={(e) => { e.stopPropagation(); toggleRecording(); }}
                className={`gap-2 ${isRecording ? "animate-pulse-glow" : ""}`}
              >
                <Mic className="w-4 h-4" />
                {isRecording ? "Stop Recording" : "Record Voice"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
