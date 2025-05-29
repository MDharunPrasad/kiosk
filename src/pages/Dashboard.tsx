import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Plus, Settings, Users, User, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/BackButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [newLocation, setNewLocation] = useState("");
  const [locations, setLocations] = useState([
    { id: 1, name: "Entrance", active: true },
    { id: 2, name: "Castle", active: true },
    { id: 3, name: "Waterfall", active: false },
    { id: 4, name: "Theme Ride", active: false },
    { id: 5, name: "First Floor", active: true },
  ]);

  // Recent sessions with tags
  const [recentSessions] = useState([
    { 
      id: 1, 
      customer: "John Doe", 
      location: "Castle", 
      photos: 5, 
      date: "2025-05-25", 
      time: "14:30",
      tag: "SS-20250525-1430",
      status: "Completed",
      revenue: "₹250"
    },
    { 
      id: 2, 
      customer: "Jane Smith", 
      location: "Waterfall", 
      photos: 3, 
      date: "2025-05-24", 
      time: "16:45",
      tag: "SS-20250524-1645",
      status: "Completed",
      revenue: "₹150"
    },
    { 
      id: 3, 
      customer: "Mike Johnson", 
      location: "Entrance", 
      photos: 8, 
      date: "2025-05-24", 
      time: "11:20",
      tag: "SS-20250524-1120",
      status: "Completed",
      revenue: "₹400"
    },
  ]);

  const addLocation = () => {
    if (newLocation.trim()) {
      setLocations([
        ...locations,
        { id: Date.now(), name: newLocation, active: true }
      ]);
      setNewLocation("");
    }
  };

  const toggleLocation = (id: number) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, active: !loc.active } : loc
    ));
  };

  const todayStats = {
    sessions: recentSessions.filter(s => s.date === "2025-05-25").length,
    revenue: recentSessions
      .filter(s => s.date === "2025-05-25")
      .reduce((sum, s) => sum + parseInt(s.revenue.replace('₹', '')), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 border-b border-blue-500 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">SnapStation</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-white bg-white hover:bg-blue-50"
              onClick={() => navigate("/profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                D
              </div>
              <span>Dharun (Admin)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        <BackButton to="/" label="Back to Login" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{todayStats.sessions}</p>
                  <p className="text-sm text-gray-600">Sessions Today</p>
                </div>
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">₹{todayStats.revenue}</p>
                  <p className="text-sm text-gray-600">Revenue Today</p>
                </div>
                <Settings className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">D</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dharun</h2>
              <p className="text-gray-600">Admin</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <Button variant="ghost" className="bg-white shadow-sm">
              <Users className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" className="text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </Button>
            <Button variant="ghost" className="text-gray-600">
              <History className="h-4 w-4 mr-2" />
              Recent Sessions
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Available Locations Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <CardTitle>Available Locations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Location */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Add New Location</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter location name"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addLocation} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Locations List */}
              <div className="space-y-3">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{location.name}</span>
                    <div className="flex items-center space-x-3">
                      <Badge variant={location.active ? "default" : "secondary"}>
                        {location.active ? "Active" : "Inactive"}
                      </Badge>
                      <Switch
                        checked={location.active}
                        onCheckedChange={() => toggleLocation(location.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-green-600" />
                <CardTitle>Recent Completed Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{session.customer}</p>
                        <p className="text-sm text-gray-600">{session.location}</p>
                      </div>
                      <Badge variant="default">
                        {session.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Tag:</strong> {session.tag}</p>
                      <p><strong>Date:</strong> {session.date} at {session.time}</p>
                      <p><strong>Photos:</strong> {session.photos}</p>
                      <p><strong>Revenue:</strong> {session.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
