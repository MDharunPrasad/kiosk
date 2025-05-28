
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Search, Image, Edit, ShoppingCart } from "lucide-react";

const Customer = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartSession = () => {
    navigate("/packages");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
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

      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold text-white mb-4">
          Capture Your Perfect Moments
        </h1>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Create stunning photo collections with our professional editing tools
        </p>

        {/* Main Action Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Start New Session */}
          <Card className="shadow-2xl border-0 hover:shadow-3xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-600">Start New Photo Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Customer Name</label>
                <Input placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location in Park</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select location</option>
                  <option>Entrance</option>
                  <option>Castle</option>
                  <option>Waterfall</option>
                  <option>Theme Ride</option>
                </select>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                onClick={handleStartSession}
              >
                Start Session →
              </Button>
            </CardContent>
          </Card>

          {/* Previous Sessions */}
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-600">Previous Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Search by name, tag or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="text-center py-8 text-gray-500">
                No sessions found
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Image className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Professional Photos</h3>
            <p className="text-blue-100">
              Capture high-quality professional photos with our state-of-the-art equipment
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Edit className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Editing</h3>
            <p className="text-blue-100">
              Edit your photos instantly with our powerful yet easy-to-use editing tools
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Multiple Devices</h3>
            <p className="text-blue-100">
              Access your photos from any device - mobile, tablet, or desktop with responsive design
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
