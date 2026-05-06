// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const COMPANY_ID=import.meta.env.VITE_COMPANY_ID;
// const TENANT_ID=import.meta.env.VITE_TENANT_ID;
// const FixedURL= "https://outscore-lingo-pentagon.ngrok-free.dev";

// class OtpService {
//   static async sendOtp(mobile: string): Promise<{ success: boolean }> {
//     // console.log("Sending OTP to", mobile);
//     // return Promise.resolve({ success: true });
//      try {
//       const response = await fetch(
//         `${BASE_URL}/SendOtp?mobile=${mobile}`,
//         {
//           method: "GET",
//           headers: {
//             "company":`${COMPANY_ID}`,
//              "tenant":`${TENANT_ID}`,
//           },
//         }
//       );
//     //   const response = await fetch(
//     //     `${FixedURL}/api/user/generateOTP`,
//     //     {
//     //       method: "POST",
//     //       headers:{
//     //       "Content-Type": "application/json",
//     //       "package":"ecommerce.mobile.andhrakitchenwares.com",
//     //       },
//     //       body: JSON.stringify({Username: mobile})
//     //     }
//     //   );
//       const data = await response.json();
//       console.log(data);
//       return {
//         success: response.ok,
//       };
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       return { success: false };
//     }
//   }


//   static async verifyOtp(
//     mobile: string,
//     otp: string
//   ): Promise<{ verified: boolean }> {
    
//     try {
//       const response = await fetch(
//         `${BASE_URL}/VerifyOtp?mobile=${mobile}&otp=${otp}`,
//         {
//           method: "GET",
//           headers: {
//            "company":`${COMPANY_ID}`,
//             "tenant":`${TENANT_ID}`,
//           },
//         }
//       );
//     //     const response = await fetch(
//     //     `${FixedURL}/api/user/validateOTP`,
//     //     {
//     //       method: "POST",
//     //       headers:{
//     //       "Content-Type": "application/json",
//     //       "package":"ecommerce.mobile.andhrakitchenwares.com",
//     //       },
//     //       body: JSON.stringify({Username: mobile,Code:otp})
//     //     }
//     //   );

//       const data = await response.json();
//       return {
//         // verified: data?.Status?.toLowerCase() === "success",
//         verified: data.success || false,
//       };
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       return { verified: false };
//     }
//   }
// }

// export default OtpService;