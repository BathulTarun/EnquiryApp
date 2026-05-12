import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectedProduct, WorkType } from "@/types/common";
import WorkTypeService from "@/services/worktype.service";
// import { SelectedSubOption } from "@/types/common";


interface WorkTypeSelectorProps {
  selected: WorkType[];
  onToggle: (type: WorkType) => void;
  // onSubChange: (id: string, value: SelectedSubOption) => void;
onUpdate: (type: WorkType) => void;
   onSubCategoryChange: (
    workTypeId: string,
    subCategory: { id: string; name: string }
  ) => void;

  onProductChange: (
    workTypeId: string,
    product: SelectedProduct
  ) => void;
}


const WorkTypeSelector = ({
  selected,
  onToggle,
  onUpdate,
  // onSubChange,
  onSubCategoryChange,
  onProductChange,
}: WorkTypeSelectorProps) => {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);

  const selectedMap = new Map(selected.map((t) => [t.id, t]));

  const getSelected = (type: WorkType) => selectedMap.get(type.id);

  // ✅ Load categories first
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await WorkTypeService.getCategores();

      // map API → WorkType
      const mapped: WorkType[] = categories.map((c: any) => ({
        id: String(c.CategoryID),  //cap CategoryID
        name: c.CategoryName, //cap CategoryName
        subOptions: [], // initially empty
      }));

      setWorkTypes(mapped);
    };

    fetchCategories();
  }, []);

  // ✅ Load products when category selected
//   const handleToggle = async (type: WorkType) => {
//     const isSelected = selectedMap.has(type.id);

//     // If already selected → just toggle off
//     if (isSelected) {
//       onToggle(type);
//       return;
//     }

//     // Fetch products only when selecting
//     const products = await WorkTypeService.getProductsByCategores(
//       Number(type.id)
//     );

//     const productOptions = products.map((p: any) => ({
//   id: String(p.UID),  // p.UID, //uid
//   name: p.Name, //p.Name, //name
//   price:p.Price, //p.Price, //price
// }));

//     const updatedType: WorkType = {
//       ...type,
//       subOptions: productOptions,
//     };

//     onToggle(updatedType);
//   };

// const handleToggle = async (type: WorkType) => {
//   const isSelected = selectedMap.has(type.id);

//   if (isSelected) {
//     onToggle(type);
//     return;
//   }

//   const subCats = await WorkTypeService.getSubCategories(
//     Number(type.id)
//   );

//   const mappedSubCats = subCats.map((s: any) => ({
//     id: String(s.SubCategoryID),
//     name: s.SubCategoryName,
//     products: [],
//   }));

//   onToggle({
//     ...type,
//     subCategories: mappedSubCats,
//   });
// };
const handleToggle = async (type: WorkType) => {
  const isSelected = selectedMap.has(type.id);

  // Remove if already selected
  if (isSelected) {
    onToggle(type);
    return;
  }

  // 1. Get sub categories
  const subCats = await WorkTypeService.getSubCategories(
    Number(type.id)
  );

  // 2. Load products for EACH subcategory
  const mappedSubCats = await Promise.all(
    subCats.map(async (s: any) => {

      const products =
        await WorkTypeService.getProductsBySubcategory(
          Number(s.SubCategoryID)
        );

      const mappedProducts = products.map((p: any) => ({
        id: String(p.UID),
        name: p.Name,
        price: p.Price,
      }));

      return {
        id: String(s.SubCategoryID),
        name: s.SubCategoryName,
        products: mappedProducts,
      };
    })
  );

  // 3. Remove subcategories with no products
  const filteredSubCats = mappedSubCats.filter(
    (sub) => sub.products.length > 0
  );

  // 4. Save in selected state
  onToggle({
    ...type,
    subCategories: filteredSubCats,
  });
};


// const handleSubCategorySelect = async (
//   type: WorkType,
//   subCat: any
// ) => {
//   const products = await WorkTypeService.getProductsBySubcategory(
//     Number(subCat.id)
//   );

//   const mappedProducts = products.map((p: any) => ({
//     id: String(p.UID),
//     name: p.Name,
//     price: p.Price,
//   }));

//   const updatedSubCats =
//     type.subCategories?.map((s) =>
//       s.id === subCat.id
//         ? { ...s, products: mappedProducts }
//         : s
//     ) || [];

// onUpdate({
//   ...type,
//   subCategories: updatedSubCats,
//   selectedSubCategory: {
//     id: subCat.id,
//     name: subCat.name,
//   },
// });

//   onSubCategoryChange(type.id!, {
//     id: subCat.id,
//     name: subCat.name,
//   });
// };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wrench size={20} className="text-primary" />
          Work Type
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workTypes.map((type) => {
            const selectedItem = getSelected(type);
            const checked = !!selectedItem;

            return (
              <div key={type.id}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    checked
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                  onClick={() => handleToggle(type)} //  changed
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => handleToggle(type)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm font-medium">{type.name}</span>
                </div>

                {/* ✅ Products as sub options */}
                {/* {checked && selectedItem?.subOptions && (
                  <div className="ml-8 mt-2 mb-1">
                   <RadioGroup
  value={selectedItem?.selectedSubOption?.id || ""}
  onValueChange={(v) => {
    const selectedProduct = selectedItem?.subOptions?.find(
      (opt) => opt.id === v
    );

    if (selectedProduct) {
      // onSubChange(type.id!, {
      //   id: selectedProduct.id,
      //   name: selectedProduct.name,
      //   price: selectedProduct.price,
      // });
      onProductChange(type.id!, {
  id: product.id,
  name: product.name,
  price: product.price,
});
    }
  }}
  className="grid grid-cols-2 gap-2"
> */}
{/* <RadioGroup value={selectedItem?.selectedSubOption || ""} onValueChange={(v) => onSubChange(type.id, v)} className="grid grid-cols-2 gap-2" > */}
                      {/* {selectedItem.subOptions.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-1.5">
                          <RadioGroupItem
                            value={opt.id}
                            id={`${type.id}-${opt.id}`}
                          />
                          <Label
                            htmlFor={`${type.id}-${opt.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {opt.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )} */}

                {/* Sub Categories */}
{checked && selectedItem?.subCategories && (
  <div className="ml-8 mt-3 space-y-3">

    <RadioGroup
      value={selectedItem.selectedSubCategory?.id || ""}
      onValueChange={(v) => {
        const subCat = selectedItem.subCategories?.find(
          (s) => s.id === v
        );

        if (subCat) {
  onUpdate({
    ...selectedItem,
    selectedSubCategory: {
      id: subCat.id,
      name: subCat.name,
    },
  });

  onSubCategoryChange(type.id!, {
    id: subCat.id,
    name: subCat.name,
  });
}
      }}
    >
      {selectedItem.subCategories.map((sub) => (
        <div key={sub.id} className="space-y-2">

          {/* SubCategory */}
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value={sub.id}
              id={`${type.id}-sub-${sub.id}`}
            />

            <Label
              htmlFor={`${type.id}-sub-${sub.id}`}
              className="cursor-pointer font-medium text-sm"
            >
              {sub.name}
            </Label>
          </div>

          {/* Products */}
          {selectedItem.selectedSubCategory?.id === sub.id &&
            sub.products &&
            sub.products.length > 0 && (
              <div className="ml-6 mt-2">
                <RadioGroup
                  value={
                    selectedItem.selectedProduct?.id || ""
                  }
                  onValueChange={(v) => {
                    const product = sub.products?.find(
                      (p) => p.id === v
                    );

                    if (product) {
                      onProductChange(type.id!, {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                      });
                    }
                  }}
                  className="grid grid-cols-2 gap-2"
                >
                  {sub.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem
                        value={product.id}
                        id={`${type.id}-product-${product.id}`}
                      />

                      <Label
                        htmlFor={`${type.id}-product-${product.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {product.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
        </div>
      ))}
    </RadioGroup>
  </div>
)}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkTypeSelector;