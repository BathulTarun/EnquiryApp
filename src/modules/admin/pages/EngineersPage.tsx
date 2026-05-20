import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import type { Engineer } from "@/types/engineer";
import { OperatorService } from "@/services/operator.service";
import { EnquiryService } from "@/services/enquiry.service";
import { CustomerService } from "@/services/customer.service";
import { Enquiry } from "@/types/enquiry";
import { Customer } from "@/types/customer";


const EngineersPage = () => {
   const navigate = useNavigate();
  const [enquiriesList, setEnquiriesList] = useState<Enquiry[]>([]);
  const[engineersList, setEngineersList] = useState<Engineer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const engs = await OperatorService.getAllOperators(); 
      setEngineersList(engs);

      const enqs = await EnquiryService.getAllEnquiries();
      setEnquiriesList(enqs);
    };
    fetchData();
  }, []);


  const getTaskCount = (id: string) => enquiriesList?.filter((e) => e.assignedEngineerId === Number(id) && e.status !== "Completed").length;
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-medium"><Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>Engineers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {engineersList?.map((eng) => (
          <Card key={eng.id} className="material-shadow cursor-pointer hover:material-shadow-lg transition-shadow" onClick={() => navigate(`/admin/engineers/${eng.id}`)}>
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
                <div className="flex items-center gap-2"><Wrench className="h-3 w-3" />{getTaskCount(String(eng.id))} active tasks</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EngineersPage;
