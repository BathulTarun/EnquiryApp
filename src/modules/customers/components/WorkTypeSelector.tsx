import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { WorkType } from "@/types/common";
import WorkTypeService from "@/services/worktype.service";
import { SelectedSubOption } from "@/types/common";

interface WorkTypeSelectorProps {
  selected: WorkType[];
  onToggle: (type: WorkType) => void;
  onSubChange: (id: string, value: string) => void;
}

const WorkTypeSelector = ({
  selected,
  onToggle,
  onSubChange,
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
        id: String(c.CategoryID),
        name: c.CategoryName,
        subOptions: [], // initially empty
      }));

      setWorkTypes(mapped);
    };

    fetchCategories();
  }, []);

  // ✅ Load products when category selected
  const handleToggle = async (type: WorkType) => {
    const isSelected = selectedMap.has(type.id);

    // If already selected → just toggle off
    if (isSelected) {
      onToggle(type);
      return;
    }

    // Fetch products only when selecting
    const products = await WorkTypeService.getProductsByCategores(
      Number(type.id)
    );

    const productOptions = products.map((p: any) => ({
  id: p.UID,
  name: p.Name,
  price:p.Price,
}));

    const updatedType: WorkType = {
      ...type,
      subOptions: productOptions,
    };

    onToggle(updatedType);
  };

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
                  onClick={() => handleToggle(type)} // ✅ changed
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => handleToggle(type)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm font-medium">{type.name}</span>
                </div>

                {/* ✅ Products as sub options */}
                {checked && selectedItem?.subOptions && (
                  <div className="ml-8 mt-2 mb-1">
                   {/* <RadioGroup
  value={selectedItem?.selectedSubOption?.id || ""}
  onValueChange={(v) => {
    const selectedProduct = selectedItem?.subOptions?.find(
      (opt) => opt.id === v
    );

    if (selectedProduct) {
      onSubChange(type.id!, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
      });
    }
  }}
  className="grid grid-cols-2 gap-2"
> */}
<RadioGroup value={selectedItem?.selectedSubOption || ""} onValueChange={(v) => onSubChange(type.id, v)} className="grid grid-cols-2 gap-2" >
                      {selectedItem.subOptions.map((opt) => (
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