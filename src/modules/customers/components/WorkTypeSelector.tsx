import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Wrench, ChevronRight } from "lucide-react";
import { SelectedProduct, WorkType } from "@/types/common";
import { useWorkTypeStore } from "@/stores/ProductDetailsStore";
import { useMemo } from "react";

interface WorkTypeSelectorProps {
  selected: WorkType[];

  onToggle: (type: WorkType) => void;

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
  onSubCategoryChange,
  onProductChange,
}: WorkTypeSelectorProps) => {
  const selectedMap = new Map(
    selected.map((t) => [t.id, t])
  );

  const {
    categories,
    subcategories,
    products,
  } = useWorkTypeStore();

  const workTypes: WorkType[] = useMemo(() => {
    return categories.map((cat: any) => ({
      id: String(cat.CategoryID),
      name: cat.CategoryName,

      subCategories:
        (subcategories[cat.CategoryID] || []).map(
          (sub: any) => ({
            id: String(sub.SubCategoryID),
            name: sub.SubCategoryName,

            products:
              (products[sub.SubCategoryID] || []).map(
                (p: any) => ({
                  id: String(p.UID),
                  name: p.Name,
                  price: p.Price,
                })
              ),
          })
        ),
    }));
  }, [categories, subcategories, products]);

  const getSelected = (type: WorkType) =>
    selectedMap.get(type.id);

  const handleToggle = (type: WorkType) => {
    onToggle(type);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wrench
            size={20}
            className="text-primary"
          />
          Work Type
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Accordion
          type="multiple"
          className="w-full"
        >
          {workTypes.map((type) => {
            const selectedItem =
              getSelected(type);

            const checked = !!selectedItem;

            const selectedCount =
              checked &&
              selectedItem?.selectedProduct
                ? 1
                : 0;

            return (
              <AccordionItem
                key={type.id}
                value={type.id}
              >
                <AccordionTrigger
                  className="hover:no-underline"
                  onClick={() =>
                    handleToggle(type)
                  }
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-sm font-medium">
                      {type.name}
                    </span>

                    {selectedCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        {selectedCount}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  {checked &&
                    selectedItem?.subCategories && (
                      <div className="pl-2 space-y-5">

                        {selectedItem.subCategories.map(
                          (sub) => (
                            <div
                              key={sub.id}
                              className="space-y-3"
                            >
                              {/* SUBCATEGORY TITLE */}
                              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                <ChevronRight
                                  size={12}
                                />
                                {sub.name}
                              </div>

                              {/* PRODUCTS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4">
                                {sub.products?.map(
                                  (product) => {
                                    const isSelected =
                                      selectedItem
                                        ?.selectedProduct
                                        ?.id ===
                                      product.id;

                                    return (
                                      <div
                                        key={
                                          product.id
                                        }
                                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${
                                          isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/40"
                                        }`}
                                        onClick={() => {
                                          onUpdate({
                                            ...selectedItem,
                                            selectedSubCategory:
                                              {
                                                id: sub.id,
                                                name:
                                                  sub.name,
                                              },
                                            selectedProduct:
                                              {
                                                id: product.id,
                                                name:
                                                  product.name,
                                                price:
                                                  product.price,
                                              },
                                          });

                                          onSubCategoryChange(
                                            type.id!,
                                            {
                                              id: sub.id,
                                              name:
                                                sub.name,
                                            }
                                          );

                                          onProductChange(
                                            type.id!,
                                            {
                                              id: product.id,
                                              name:
                                                product.name,
                                              price:
                                                product.price,
                                            }
                                          );
                                        }}
                                      >
                                        <Checkbox
                                          checked={
                                            isSelected
                                          }
                                        />

                                        <span className="text-sm">
                                          {
                                            product.name
                                          }
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default WorkTypeSelector;