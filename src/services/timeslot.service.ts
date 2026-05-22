import {timeSlots} from "@/data/timeslot.mock";
import {TimeSlot} from "@/types/timeslot";

export class TimeSlotService {
  static async getSlots(
    date: string,
  ): Promise<(TimeSlot & {isPast: boolean})[]> {
    const now = new Date();
    const selected = date ? new Date(date + "T00:00:00") : null;

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
}
