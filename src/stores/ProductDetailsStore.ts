import {create} from "zustand";
import WorkTypeService from "@/services/worktype.service";

type WorkTypeStore = {
  categories: any[];

  subcategories: Record<number, any[]>;

  products: Record<number, any[]>;

  loadCategories: () => Promise<void>;

  loadSubcategories: (categoryId: number) => Promise<void>;

  loadProducts: (subcategoryId: number) => Promise<void>;

  clearWorkTypes: () => void;
};

export const useWorkTypeStore = create<WorkTypeStore>((set, get) => ({
  categories: [],

  subcategories: {},

  products: {},

  loadCategories: async () => {
    if (get().categories.length) return;

    const data = await WorkTypeService.getCategores();

    set({categories: data});
  },

  loadSubcategories: async (categoryId) => {
    const existing = get().subcategories[categoryId];

    if (existing) return;

    const data = await WorkTypeService.getSubCategories(categoryId);

    set((state) => ({
      subcategories: {
        ...state.subcategories,
        [categoryId]: data,
      },
    }));
  },

  loadProducts: async (subcategoryId) => {
    const existing = get().products[subcategoryId];

    if (existing) return;

    const data = await WorkTypeService.getProductsBySubcategory(subcategoryId);

    set((state) => ({
      products: {
        ...state.products,
        [subcategoryId]: data,
      },
    }));
  },

  clearWorkTypes: () => {
    set({
      categories: [],
      subcategories: {},
      products: {},
    });
  },
}));
