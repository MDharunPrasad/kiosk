
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Users, Settings } from "lucide-react";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password && selectedRole) {
      // In a real app, you'd validate credentials here
      switch (selectedRole) {
        case "admin":
          navigate("/dashboard");
          break;
        case "photographer":
          navigate("/photographer");
          break;
        case "customer":
          navigate("/customer");
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
      {/* Header */}
      <header className="bg-blue-600 border-b border-blue-500 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">SnapStation</h1>
          </div>
          <Button 
            variant="outline" 
            className="text-blue-600 border-white bg-white hover:bg-blue-50"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-600">Login</CardTitle>
              <CardDescription>
                Sign in to access your SnapStation account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="admin" className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="photographer" className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <Camera className="h-4 w-4" />
                        <span>Photographer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="customer" className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Customer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!email || !password || !selectedRole}
              >
                Login
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button 
                  onClick={() => navigate("/register")}
                  className="text-blue-600 hover:underline"
                >
                  Register here
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
