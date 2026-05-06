
import { timeSlots } from "@/data/timeslot.mock";
import { TimeSlot } from "@/types/timeslot";

const BASE_URL = "http://localhost:7071/api";
const COMPANY_ID=import.meta.env.VITE_COMPANY_ID;
const TENANT_ID=import.meta.env.VITE_TENANT_ID;

export class TimeSlotService {

  static async getSlots(date: string): Promise<
    (TimeSlot & { isPast: boolean })[]
  > {
    const now = new Date();
    const selected = date ? new Date(date + "T00:00:00") : null;


    // try{
    //   const response= await fetch(
    //    `${BASE_URL}/gettimeslots`,
    //    {
    //     method:"GET",
    //     headers:{
    //        "company":`${COMPANY_ID}`,
    //             "tenant":`${TENANT_ID}`,
    //     },
    //    }
    //   );

    //   if(!response.ok){
    //      throw new Error("Failed to fetch slots");
    //   }

    //    const result = await response.json();

    //     const slots: TimeSlot[] = result.data;

    //     return slots.map((slot) => {
    //     let isPast = false;

    //     if (selected) {
    //       const slotTime = new Date(selected);
    //       slotTime.setHours(slot.startHour, 0, 0, 0);

    //       //  Accurate comparison
    //       isPast = slotTime < now;
    //     }

    //     return {
    //       ...slot,
    //       isPast,
    //     };
    //       });
    // } catch (error) {
    //   console.error("Error fetching slots:", error);
    //   return [];
    // }

          return timeSlots.map((slot) => {
      let isPast = false;

      if (selected) {
        const slotTime = new Date(selected);
        slotTime.setHours(slot.startHour, 0, 0, 0);

        if (selected.toDateString() !== now.toDateString()) {
          isPast = selected < new Date(now.toDateString());
        } else {
          isPast = slot.startHour <= now.getHours();
        }
      }

      return {
        ...slot,
        isPast,
      };
    });

    }

    // return timeSlots.map((slot) => {
    //   let isPast = false;

    //   if (selected) {
    //     const slotTime = new Date(selected);
    //     slotTime.setHours(slot.startHour, 0, 0, 0);

    //     if (selected.toDateString() !== now.toDateString()) {
    //       isPast = selected < new Date(now.toDateString());
    //     } else {
    //       isPast = slot.startHour <= now.getHours();
    //     }
    //   }

    //   return {
    //     ...slot,
    //     isPast,
    //   };
    // });

// }











  //  Get slots with status
//   static async getSlotsWithStatus(date: Date): Promise<
//     (TimeSlot & { isPast: boolean })[]
//   > {
//     const now = new Date();

//     return timeSlots.map((slot) => {
//       const slotTime = new Date(date);
//       slotTime.setHours(slot.startHour, 0, 0, 0);

//       return {
//         ...slot,
//         isPast: slotTime < now,
//       };
//     });
//   }
}