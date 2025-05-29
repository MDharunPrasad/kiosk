import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, History, User, MapPin, Settings, Plus, Clock, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import BackButton from "@/components/ui/BackButton";

interface Session {
  id: number;
  customer: string;
  location: string;
  photos: number;
  date: string;
  time: string;
  tag: string;
  status: string;
}

const Photographer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLocationManager, setShowLocationManager] = useState(false);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [displayedSessions, setDisplayedSessions] = useState<Session[]>([]);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const { newSession } = location.state || {};

  const todayStats = {
    sessions: 8,
    revenue: "₹2,840"
  };

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = JSON.parse(localStorage.getItem('recentSessions') || '[]');
    // Filter out any duplicate sessions based on tag
    const uniqueSessions = savedSessions.filter((session, index, self) =>
      index === self.findIndex(s => s.tag === session.tag)
    );
    setRecentSessions(uniqueSessions);
    // Initially show only 3 sessions
    setDisplayedSessions(uniqueSessions.slice(0, 3));
  }, []);

  useEffect(() => {
    // If there's a new session from Cart, update the list
    if (newSession) {
      setRecentSessions(prev => {
        // Check if session with same tag already exists
        const exists = prev.some(session => session.tag === newSession.tag);
        if (!exists) {
          return [newSession, ...prev];
        }
        return prev;
      });
    }
  }, [newSession]);

  const handleAddLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const handleRemoveLocation = (locationToRemove: string) => {
    setLocations(locations.filter(loc => loc !== locationToRemove));
  };

  const handleManageLocations = () => {
    setShowLocationManager(true);
  };

  const handleViewAllSessions = () => {
    setShowAllSessions(true);
  };

  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      // Remove from localStorage
      const existingSessions = JSON.parse(localStorage.getItem('recentSessions') || '[]');
      const updatedSessions = existingSessions.filter((s: Session) => s.tag !== sessionToDelete.tag);
      localStorage.setItem('recentSessions', JSON.stringify(updatedSessions));

      // Update state
      setRecentSessions(updatedSessions);
      setDisplayedSessions(updatedSessions.slice(0, 3));
      setSessionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setSessionToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 border-b border-blue-500 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Camera className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">SnapStation</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
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
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm">P</span>
              </div>
              <span className="hidden sm:inline">Photographer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <BackButton to="/" label="Back to Login" />
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Photographer Dashboard</h1>
          <p className="text-gray-600">Manage photo sessions and track your daily performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{todayStats.sessions}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Sessions Today</p>
                </div>
                <Camera className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{todayStats.revenue}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Revenue Today</p>
                </div>
                <Settings className="h-6 sm:h-8 w-6 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-blue-600">Quick Actions</CardTitle>
              <CardDescription>Start a new photo session or manage settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-base sm:text-lg py-4 sm:py-6"
                onClick={() => navigate("/new-session")}
              >
                <Camera className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                Start New Photo Session
              </Button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="py-3 sm:py-4"
                  onClick={handleManageLocations}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Manage Locations
                </Button>
                <Button 
                  variant="outline" 
                  className="py-3 sm:py-4"
                  onClick={handleViewAllSessions}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Manager or Recent Sessions */}
          {showLocationManager ? (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <CardTitle>Manage Locations</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowLocationManager(false)}>
                    Close
                  </Button>
                </div>
                <CardDescription>Add or remove photo session locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter new location"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                    />
                    <Button onClick={handleAddLocation}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Current Locations:</h4>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {locations.map((location, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{location}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveLocation(location)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Recent Sessions */
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-green-600" />
                    <CardTitle>Recent Sessions</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleViewAllSessions}>
                    View All
                  </Button>
                </div>
                <CardDescription>Your recently completed photo sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayedSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{session.customer}</p>
                          <p className="text-sm text-gray-600">{session.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={session.status === "Completed" ? "default" : "secondary"}>
                            {session.status}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteSession(session)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Tag:</strong>{" "}
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                            {session.tag}
                          </span>
                        </p>
                        <p><strong>Date:</strong> {session.date}</p>
                        <p><strong>Time:</strong> {session.time}</p>
                        <p><strong>Photos:</strong> {session.photos} photos</p>
                      </div>
                    </div>
                  ))}
                  {displayedSessions.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No recent sessions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* View All Sessions Dialog */}
        <Dialog open={showAllSessions} onOpenChange={setShowAllSessions}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Photo Sessions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{session.customer}</p>
                      <p className="text-sm text-gray-600">{session.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={session.status === "Completed" ? "default" : "secondary"}>
                        {session.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteSession(session)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Tag:</strong>{" "}
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                        {session.tag}
                      </span>
                    </p>
                    <p><strong>Date:</strong> {session.date}</p>
                    <p><strong>Time:</strong> {session.time}</p>
                    <p><strong>Photos:</strong> {session.photos} photos</p>
                  </div>
                </div>
              ))}
              {recentSessions.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No sessions available
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this session?<br />
                {sessionToDelete && (
                  <span className="font-medium">
                    {sessionToDelete.customer} - {sessionToDelete.tag}
                  </span>
                )}
                <br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Photographer;
