import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAppStore } from "@/services/appStore";

export default function Index() {
  const navigate = useNavigate();

  const role = useAppStore((s) => s.role);
  const logout = useAppStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      
      {/* 🔥 TOP RIGHT BUTTON */}
      <div className="absolute top-4 right-4">
       
          <Button onClick={() => navigate("/globalLogin")}>
            Login
          </Button>
       
      </div>

      {/* 🔹 HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Service Management Portal
        </h1>
        <p className="text-muted-foreground">
          Manage customer enquiries and schedule site visits efficiently
        </p>
      </div>

      {/* 🔥 ONLY CUSTOMER CARD */}
      <div className="flex justify-center w-full">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow w-full max-w-sm"
          onClick={() => navigate("/customer")}
        >
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-3 text-center">
            <Users className="h-12 w-12 text-primary" />
            <h2 className="font-bold text-lg">Customer</h2>
            <p className="text-sm text-muted-foreground">
              Submit & track enquiries
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}