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
  const [isListening, setIsListening] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) return;
    OtpService.sendOtp(mobile).then((res) => {
      if (!res) {
        toast.success("Failed to send OTP try again", {
          duration: 5000,
        });
        return;
      }
      if (res.success) {
        toast.success("OTP sent successfully", {
          duration: 5000,
        });
        onSearch(mobile);
      } else {
        toast.error("Failed to send OTP try again", {
          duration: 5000,
        });
      }
    });
  };

  const handleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice recognition is not supported on this PlatForm.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...");
    };

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      transcript = transcript.toLowerCase();

      const numberMap: Record<string, string> = {
        zero: "0",
        one: "1",
        two: "2",
        three: "3",
        four: "4",
        five: "5",
        six: "6",
        seven: "7",
        eight: "8",
        nine: "9",
      };

      Object.entries(numberMap).forEach(([word, digit]) => {
        transcript = transcript.replace(new RegExp(word, "g"), digit);
      });

      const digits = transcript.replace(/\D/g, "").slice(0, 10);

      setMobile(digits);

      if (digits.length === 10) {
        recognition.stop();
        // onSearch(digits);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error(`Voice Error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Recognition ended");
    };

    recognition.start();
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
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
            isListening ? "text-red-500 animate-pulse" : "text-muted-foreground"
          }`}
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
