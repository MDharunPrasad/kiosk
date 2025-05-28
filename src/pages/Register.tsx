
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Users, Settings } from "lucide-react";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (fullName && email && password && confirmPassword && selectedRole) {
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      // In a real app, you'd create the account here
      alert("Account created successfully! Please login.");
      navigate("/");
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
            onClick={() => navigate("/")}
          >
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-600">Register</CardTitle>
              <CardDescription>
                Create your SnapStation account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>

              <Button 
                onClick={handleRegister}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!fullName || !email || !password || !confirmPassword || !selectedRole}
              >
                Register
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button 
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:underline"
                >
                  Login here
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
