import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, User, MapPin } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const NewSession = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const locations = [
    "Castle",
    "First Floor", 
    "Entrance",
    "Waterfall",
    "Theme Ride",
    "Garden Area",
    "Main Hall"
  ];

  const handleStartSession = () => {
    if (!customerName.trim() || !selectedLocation) {
      alert("Please fill in all fields");
      return;
    }
    
    navigate("/packages", { 
      state: { 
        customerName, 
        selectedLocation 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      {/* Header */}
      <header className="bg-blue-600 border-b border-blue-500 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Camera className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">SnapStation</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm">P</span>
              </div>
              <span className="hidden sm:inline">Photographer</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-white bg-white hover:bg-blue-50"
              onClick={() => navigate("/photographer")}
            >
              Back
            </Button>
          </div>
        </div>
      </header>

      <BackButton to="/photographer" label="Back to Photographer Dashboard" />

      {/* Main Content */}
      <div className="text-center py-8 sm:py-16 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
          Start New Photo Session
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-2xl mx-auto">
          Create a new photo session for your customer
        </p>

        <div className="max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-blue-600">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Customer Name
                </label>
                <Input 
                  placeholder="Enter customer name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location in Park
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                onClick={handleStartSession}
                disabled={!customerName.trim() || !selectedLocation}
              >
                Start Session →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewSession;
