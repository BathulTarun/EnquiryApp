import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic } from "lucide-react";

import OtpService from "@/services/otp.service";


import { CustomerService } from "@/services/customer.service";
import { AuthService } from "@/services/authService.service";
import { TokenManager } from "@/services/tokenManager.service";
interface MobileInputProps {
  onSearch: (mobile: string) => void;
  isLoading?: boolean;
}
// export class LoginModel {
//     Username!: string;
//     Password!: string;
//     Package!: string;
//   }

const MobileInput =   ({ onSearch, isLoading }: MobileInputProps) => {
  const [mobile, setMobile] = useState("");

  // const loginData = {
  //      Username: "kksanghi",
  //      Password:"000000",
  //      Package: "ecommerce.mobile.transactiontracker.in",
  //      grant_type: "password"  
  //   };
  const handleSubmit = async (e: React.FormEvent) => {
   
    e.preventDefault();
    if (mobile.length === 10) onSearch(mobile);
    OtpService.sendOtp(mobile).then((res) => {
      if (res.success) {
        console.log("OTP sent successfully");
      } else {
        console.log("Failed to send OTP");
      }
    });
    // otpService2.generateOTP(mobile).then((res) => {
    //   if (res.success) {
    //     console.log("OTP sent successfully");
    //   } else {
    //     console.log("Failed to send OTP");
    //   }
    // });

     

    // tokenService.tokenGenerate(loginData).then((res) => {
    //   if (res.success) {
    //     console.log("OTP sent successfully");
    //   } else {
    //     console.log("Failed to send OTP");
    //   }
    // });

    //  CustomerService.getEnquriesByCustomerId(19627).then((res)=>{
    //   if(res.success){
    //     console.log(res+"enquries");
    //   }else{
    //     console.log("failed enquries");
    //   }
    //  })
    
  };

  const handleVoice = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
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
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
      <Button type="submit" disabled={mobile.length !== 10 || isLoading} size="lg">
        <Search size={18} />
        Search
      </Button>
    </form>
  );
};

export default MobileInput;
