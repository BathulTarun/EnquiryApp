import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ShieldCheck } from "lucide-react";
import  OtpService  from "@/services/otp.service";
import { AuthService } from "@/services/authService.service";
import { TokenManager } from "@/services/tokenManager.service";
import { toast } from "sonner";

interface OTPVerificationProps {
  mobile: string;
  onVerified: () => void;
}


const RESEND_TIMER = 30;

const OTPVerification = ({ mobile, onVerified }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);

  
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 5) return;
    setIsVerifying(true);
    setError("");

   try {
    const res = await OtpService.verifyOtp(mobile, otp);
    
    if (res.verified) {
      toast.success("OTP verified successfully!",{
        duration: 5000,
      });
  //       const token=   await AuthService.getToken({ username: mobile, password: mobile });
  // TokenManager.setToken(token);

      onVerified(); // success
     
    } else {
      toast.error("Invalid OTP. Please try again.",{
        duration: 5000,
      });
      setOtp("");
      setError("Invalid OTP");
    }
  } catch (err) {
    toast.error("Something went wrong. Please try again.",{
      duration: 5000,
    });
    setError("Something went wrong");
  }

    
    setIsVerifying(false);
  };

  const handleResend = async () => {
     OtpService.sendOtp(mobile).then((res) => {
          if (res.success) {
            toast.success("OTP sent successfully",{
              duration: 5000,
            });
            // console.log("OTP sent successfully");
          } else {
            toast.error("Failed to send OTP try again",{
              duration: 5000,
            });
            // console.log("Failed to send OTP");
          }
        });
    setIsSending(true);
    setError("");
    setOtp("");
    await new Promise((r) => setTimeout(r, 600));
    setIsSending(false);
    setCanResend(false);
    setTimer(RESEND_TIMER);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">Verify OTP</h2>
        <p className="text-sm text-muted-foreground">
          A 5-digit code has been sent to <span className="font-medium text-foreground">{mobile}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={5} value={otp} onChange={(val) => { setOtp(val); setError(""); }}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            {/* <InputOTPSlot index={5} /> */}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      <Button
        onClick={handleVerify}
        disabled={otp.length !== 5 || isVerifying}
        className="w-full max-w-xs mx-auto"
        size="lg"
      >
        {isVerifying && <Loader2 className="animate-spin" />}
        Verify OTP
      </Button>

      <div className="text-sm text-muted-foreground">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isSending}
            className="text-primary font-medium hover:underline disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Resend OTP"}
          </button>
        ) : (
          <span>Resend OTP in <span className="font-medium text-foreground">{timer}s</span></span>
        )}
      </div>

      
    </div>
  );
};

export default OTPVerification;
