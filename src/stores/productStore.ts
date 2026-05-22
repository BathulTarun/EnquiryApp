import {create} from "zustand";
import WorkTypeService from "@/services/worktype.service";

type ProductStore = {
  productNames: Record<string, string>;
  loadProducts: (ids: string[]) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  productNames: {},

  loadProducts: async (ids) => {
    const existing = get().productNames;

    // only fetch missing ids
    const missingIds = ids.filter((id) => !existing[id]);

    if (missingIds.length === 0) return;

    const newProducts: Record<string, string> = {};

    await Promise.all(
      missingIds.map(async (id) => {
        try {
          const product = await WorkTypeService.getProductsByID(id);

          newProducts[id] = product?.Name || "";
        } catch (err) {
          console.error("Failed product:", id);
        }
      }),
    );

    set({
      productNames: {
        ...existing,
        ...newProducts,
      },
    });
  },
}));
