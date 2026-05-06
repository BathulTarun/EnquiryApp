import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/services/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ClipboardList } from "lucide-react";
import { engineers } from "@/data/adminMockData";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAppStore((s) => s.login);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const result = await login(username, password); 

  if (!result) {
    setError("Invalid username or password");
    return;
  }

  if (result.role === "admin") {
    navigate("/admin/dashboard");
  } else if (result.role === "operator") {
    navigate(`/operator/dashboard/${result.id}`);

    console.log("Logged in as operator with ID:", result.id);
    console.log(
      "Operator Name:",
      engineers.find((e) => e.id === result.id)?.name
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
     
      <Card className="w-full max-w-sm material-shadow-lg animate-fade-in relative">
        <Button  variant="ghost" onClick={() => navigate("/")}  className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted" >
        <ArrowLeft size={16} />
         Go Back
      </Button>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <ClipboardList className="h-6 w-6 text-primary-foreground" />
          </div>

          <CardTitle className="text-xl font-medium">Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Admin / Operator Access
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* USERNAME */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* LOGIN BUTTON */}
            <Button type="submit" className="w-full">
              Login
            </Button>

            {/* OPTIONAL HELP TEXT */}
            <p className="text-xs text-muted-foreground text-center">
              Use admin / operator credentials
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;