import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, User, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { OperatorService } from "@/services/operator.service";
import { EnquiryService } from "@/services/enquiry.service";
import { CustomerService } from "@/services/customer.service";

import type { Engineer } from "@/types/engineer";
import type { Enquiry } from "@/types/enquiry";
import type { Customer } from "@/types/customer";

import { format } from "date-fns";

const EngineerDetailsPage = () => {
  const { id } = useParams();
  const enginnerid =Number(id);
  const navigate = useNavigate();

  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const engs = await OperatorService.getAllOperators();
      const found = engs.find((e) => e.id === enginnerid);

      setEngineer(found || null);

      const enqs = await EnquiryService.getAllEnquiries();
      setEnquiries(enqs);

      const custs = await CustomerService.getAllCustomers();
      setCustomers(custs);
    };

    loadData();
  }, [id]);

  const engineerTasks =
    enquiries?.filter((e) => e.assignedEngineerId === enginnerid) || [];

  if (!engineer) {
    return <div>Engineer not found</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/engineers")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>

        <h2 className="text-2xl font-medium">
          Engineer Details
        </h2>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                {engineer.name}
              </h3>

              <p className="text-muted-foreground">
                {engineer.specialization}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {engineer.phone}
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {engineer.email}
            </div>

            <div>
              <Badge
                variant={
                  engineer.status === "Available"
                    ? "default"
                    : "secondary"
                }
              >
                {engineer.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-medium mb-3">
          Assigned Tasks
        </h3>

        {engineerTasks.length === 0 ? (
          <p className="text-muted-foreground">
            No tasks assigned.
          </p>
        ) : (
          <div className="space-y-3">
            {engineerTasks.map((t) => {
              const customer = customers.find(
                (c) => c.id === t.customer.id
              );

              return (
                <Card key={t.id} onClick={()=> navigate(`/admin/enquiries/${t.id}`)} className="cursor-pointer hover:material-shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {customer?.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {t.workTypes
                            .map((w) => w.name)
                            .join(", ")}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {format(
                            new Date(t.createdAt),
                            "dd MMM yyyy"
                          )}
                        </p>
                      </div>

                      <Badge variant="outline">
                        {t.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineerDetailsPage;