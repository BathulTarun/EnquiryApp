import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "@/services/appStore";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ArrowLeft, Loader2} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {ClipboardList} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAppStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (!result) {
        setError("Invalid username or password");
        setUsername("");
        setPassword("");
        return;
      }

      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.role === "operator") {
        navigate(`/operator/dashboard/${result.id}`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setUsername("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm material-shadow-lg animate-fade-in relative">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted"
          disabled={loading}
        >
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            {/* ERROR */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>

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
