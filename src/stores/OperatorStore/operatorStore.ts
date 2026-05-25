import {create} from "zustand";
import {OperatorService} from "@/services/operator.service";
import {Enquiry} from "@/types/enquiry";

interface OperatorStore {
  enquiries: Enquiry[];

  loading: boolean;

  loaded: boolean;

  fetchEnquiries: (engineerId: string, force?: boolean) => Promise<void>;

  updateLocalEnquiry: (updated: Enquiry) => void;

  clearStore: () => void;
}

export const useOperatorStore = create<OperatorStore>((set, get) => ({
  enquiries: [],

  loading: false,

  loaded: false,

  fetchEnquiries: async (engineerId, force = false) => {
    // IMPORTANT
    // if already loaded and not force refresh
    if (get().loaded && !force) return;

    set({loading: true});

    try {
      const res = await OperatorService.getEnquriesByOperatorId(engineerId);
      if (res) {
        set({
          enquiries: res,
          loaded: true,
          loading: false,
        });
      } else {
        set({
          loading: false,
        });
      }
    } catch (err) {
      set({
        loading: false,
      });
    }
  },

  updateLocalEnquiry: (updated) => {
    set((state) => ({
      enquiries: state.enquiries.map((e) =>
        e.id === updated.id ? updated : e,
      ),
    }));
  },

  clearStore: () =>
    set({
      enquiries: [],
      loaded: false,
    }),
}));
