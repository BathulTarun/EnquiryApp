import {useWorkTypeStore} from "@/stores/ProductDetailsStore";

export const preloadWorkTypeData = async () => {
  const {loadCategories, loadSubcategories, loadProducts} =
    useWorkTypeStore.getState();

  // categories
  await loadCategories();

  // categories from store
  const cats = useWorkTypeStore.getState().categories;

  // load all subcategories
  await Promise.all(
    cats.map((cat) => loadSubcategories(Number(cat.CategoryID))),
  );

  // updated subcategories
  const allSubcategories = useWorkTypeStore.getState().subcategories;

  // flatten
  const subList = Object.values(allSubcategories).flat();

  // load all products
  await Promise.all(
    subList.map((sub) => loadProducts(Number(sub.SubCategoryID))),
  );
};
