import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search, Mic} from "lucide-react";
import OtpService from "@/services/otp.service";
import {toast} from "sonner";

interface MobileInputProps {
  onSearch: (mobile: string) => void;
  isLoading?: boolean;
}

const MobileInput = ({onSearch, isLoading}: MobileInputProps) => {
  const [mobile, setMobile] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) onSearch(mobile);
    OtpService.sendOtp(mobile).then((res) => {
      if (res.success) {
        toast.success("OTP sent successfully", {
          duration: 5000,
        });
      } else {
        toast.error("Failed to send OTP try again", {
          duration: 5000,
        });
      }
    });
  };

  const handleVoice = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.replace(/\s/g, "");
        if (/^\d{10}$/.test(transcript)) {
          setMobile(transcript);
          onSearch(transcript);
        }
      };
      recognition.start();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Input
          type="tel"
          placeholder="Enter 10-digit mobile number"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          className="pr-10 h-12 text-base"
        />
        <button
          type="button"
          onClick={handleVoice}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          title="Voice input"
        >
          <Mic size={20} />
        </button>
      </div>
      <Button
        type="submit"
        disabled={mobile.length !== 10 || isLoading}
        size="lg"
      >
        <Search size={18} />
        Search
      </Button>
    </form>
  );
};

export default MobileInput;
