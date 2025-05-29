import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, User, MapPin, Settings, History, Download, Eye, LogOut } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const Profile = () => {
  const navigate = useNavigate();
  const [userRole] = useState("admin"); // This would come from auth context
  
  // Mock user data
  const userData = {
    admin: {
      name: "Dharun",
      email: "dharun@snapstation.com",
      role: "Administrator",
      joinDate: "2024-01-15",
      totalSessions: 156,
      totalRevenue: "₹78,450",
      locations: 12
    },
    photographer: {
      name: "Photographer Name",
      email: "photographer@snapstation.com",
      role: "Photographer",
      joinDate: "2024-03-20",
      totalSessions: 89,
      totalRevenue: "₹44,500",
      completedToday: 5
    },
    customer: {
      name: "Customer Name",
      email: "customer@example.com",
      role: "Customer",
      joinDate: "2024-05-15",
      totalSessions: 3,
      totalSpent: "₹1,250"
    }
  };

  const currentUser = userData[userRole as keyof typeof userData];

  // Mock invoice data
  const invoices = [
    {
      id: "INV-001",
      sessionTag: "SS-20250525-1430",
      customer: "John Doe",
      amount: "₹250",
      date: "2025-05-25",
      status: "Paid",
      items: ["5 Photos", "Standard Package", "Digital Copies"]
    },
    {
      id: "INV-002", 
      sessionTag: "SS-20250524-1645",
      customer: "Jane Smith",
      amount: "₹150",
      date: "2025-05-24",
      status: "Paid",
      items: ["3 Photos", "Basic Package", "Digital Copies"]
    }
  ];

  const locations = [
    { id: 1, name: "Castle", active: true, sessions: 45 },
    { id: 2, name: "Waterfall", active: true, sessions: 32 },
    { id: 3, name: "Entrance", active: false, sessions: 28 }
  ];

  const handleDownloadInvoice = (invoiceId: string) => {
    // Mock download functionality
    console.log(`Downloading invoice ${invoiceId}`);
    alert(`Downloading invoice ${invoiceId}`);
  };

  const handleViewInvoice = (invoiceId: string) => {
    // Mock view functionality
    console.log(`Viewing invoice ${invoiceId}`);
    alert(`Viewing invoice ${invoiceId}`);
  };

  const handleLogout = () => {
    // Mock logout functionality
    console.log("Logging out...");
    alert("Logged out successfully!");
    navigate("/");
  };

  const getBackRoute = () => {
    switch (userRole) {
      case "admin": return "/dashboard";
      case "photographer": return "/photographer";
      case "customer": return "/customer";
      default: return "/";
    }
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
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span>{currentUser.name} ({currentUser.role})</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="text-blue-600 border-white bg-white hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        <BackButton to={getBackRoute()} label={`Back to ${userRole === 'admin' ? 'Dashboard' : userRole === 'photographer' ? 'Photographer Dashboard' : 'Customer Portal'}`} />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your activity</p>
        </div>

        {/* Profile Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{currentUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{currentUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <Badge className="ml-2">{currentUser.role}</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                  <p className="text-lg">{currentUser.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Sessions</label>
                  <p className="text-lg">{currentUser.totalSessions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {userRole === "customer" ? "Total Spent" : "Total Revenue"}
                  </label>
                  <p className="text-lg text-green-600 font-semibold">
                    {userRole === "customer" ? (currentUser as any).totalSpent : (currentUser as any).totalRevenue}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific content */}
        {userRole === "admin" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* All Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>All Invoices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{invoice.id}</p>
                          <p className="text-sm text-gray-600">Tag: {invoice.sessionTag}</p>
                          <p className="text-sm text-gray-600">Customer: {invoice.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{invoice.amount}</p>
                          <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewInvoice(invoice.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(invoice.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Location Management</h4>
                  <p className="text-sm text-gray-600 mb-3">Manage all photo session locations</p>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <div key={location.id} className="flex justify-between items-center">
                        <span className="text-sm">{location.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{location.sessions} sessions</span>
                          <Badge variant={location.active ? "default" : "secondary"}>
                            {location.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">User Management</h4>
                  <p className="text-sm text-gray-600">Total Users: 45</p>
                  <p className="text-sm text-gray-600">Active Photographers: 12</p>
                  <p className="text-sm text-gray-600">Total Customers: 32</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {userRole === "photographer" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Photographer Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>My Session Invoices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{invoice.sessionTag}</p>
                          <p className="text-sm text-gray-600">{invoice.customer}</p>
                        </div>
                        <p className="font-bold text-green-600">{invoice.amount}</p>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {invoice.items.join(" • ")}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewInvoice(invoice.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(invoice.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>My Locations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locations.map((location) => (
                    <div key={location.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-gray-600">{location.sessions} sessions completed</p>
                      </div>
                      <Badge variant={location.active ? "default" : "secondary"}>
                        {location.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {userRole === "customer" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>My Orders & Invoices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.slice(0, 1).map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Session: {invoice.sessionTag}</p>
                        <p className="text-sm text-gray-600">Invoice: {invoice.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{invoice.amount}</p>
                        <Badge variant="default">{invoice.status}</Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <p>Items: {invoice.items.join(", ")}</p>
                      <p>Date: {invoice.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewInvoice(invoice.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Invoice
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(invoice.id)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
