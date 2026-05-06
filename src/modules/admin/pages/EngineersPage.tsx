import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Phone, Mail, Wrench } from "lucide-react";
import { format } from "date-fns";
import type { Engineer } from "@/types/engineer";
import { OperatorService } from "@/services/operator.service";
import { EnquiryService } from "@/services/enquiry.service";
import { CustomerService } from "@/services/customer.service";
import { Enquiry } from "@/types/enquiry";
import { Customer } from "@/types/customer";


const EngineersPage = () => {
  const [selected, setSelected] = useState<Engineer | null>(null);
  const[customersList, setCustomersList] = useState<Customer[]>([]);;
  const [enquiriesList, setEnquiriesList] = useState<Enquiry[]>([]);
  const[engineersList, setEngineersList] = useState<Engineer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const engs = await OperatorService.getAllOperators(); 
      setEngineersList(engs);

      const enqs = await EnquiryService.getAllEnquiries();
      setEnquiriesList(enqs);
      const custs = await CustomerService.getAllCustomers();
      setCustomersList(custs);
    };
    fetchData();
  }, []);


  const getTaskCount = (id: string) => enquiriesList?.filter((e) => e.assignedEngineerId === id && e.status !== "Completed").length;
  const getEngineerTasks = (id: string) => enquiriesList?.filter((e) => e.assignedEngineerId === id);

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-medium">Engineers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {engineersList?.map((eng) => (
          <Card key={eng.id} className="material-shadow cursor-pointer hover:material-shadow-lg transition-shadow" onClick={() => setSelected(eng)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{eng.name}</p>
                    <p className="text-xs text-muted-foreground">{eng.specialization}</p>
                  </div>
                </div>
                <Badge variant={eng.status === "Available" ? "default" : "secondary"}
                  className={eng.status === "Available" ? "bg-success text-success-foreground" : ""}>
                  {eng.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{eng.phone}</div>
                <div className="flex items-center gap-2"><Wrench className="h-3 w-3" />{getTaskCount(eng.id)} active tasks</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.name}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{selected.phone}</div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{selected.email}</div>
                  <div className="flex items-center gap-2"><Wrench className="h-4 w-4 text-muted-foreground" />{selected.specialization}</div>
                  <Badge variant={selected.status === "Available" ? "default" : "secondary"}
                    className={selected.status === "Available" ? "bg-success text-success-foreground w-fit" : "w-fit"}>
                    {selected.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Assigned Tasks</h4>
                  {getEngineerTasks(selected.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tasks assigned.</p>
                  ) : (
                    <div className="space-y-2">
                      {getEngineerTasks(selected.id).map((t) => {
                        const c = customersList?.find((cu) => cu.id === t.customer.id);
                        return (
                          <div key={t.id} className="text-sm border rounded p-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{c?.name}</span>
                              <Badge variant="outline" className="text-xs">{t.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{t.workTypes.map((wt) => wt.name).join(", ")} · {format(new Date(t.createdAt), "dd MMM yyyy")}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EngineersPage;
