import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ShoppingCart, CheckCircle, Printer, Eye, User, ArrowLeft } from "lucide-react";

// Add interface for Session type
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

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPackage, allPhotos, customerName, selectedLocation, editSettings } = location.state || {};

  const packageDetails = {
    basic: { name: "Basic Pack", price: 50, photos: 2 },
    standard: { name: "Standard Pack", price: 250, photos: 5 },
    premium: { name: "Premium Pack", price: 500, photos: 10 },
    unlimited: { name: "Unlimited Pack", price: 999, photos: "Unlimited" }
  };

  const currentPackage = packageDetails[selectedPackage] || packageDetails.standard;
  const subtotal = currentPackage.price;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  const handleCompletePurchase = () => {
    // Generate session tag
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
    const sessionTag = `SS-${dateStr}-${timeStr}`;

    // Create new session
    const newSession: Session = {
      id: Date.now(),
      customer: customerName,
      location: selectedLocation,
      photos: allPhotos?.length || 0,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString().slice(0, 5),
      tag: sessionTag,
      status: "Completed"
    };

    // Get existing sessions from localStorage or initialize empty array
    const existingSessions = JSON.parse(localStorage.getItem('recentSessions') || '[]');
    
    // Check if a session with the same tag already exists
    const isDuplicate = existingSessions.some(session => session.tag === newSession.tag);
    
    // Only add the session if it's not a duplicate
    if (!isDuplicate) {
      const updatedSessions = [newSession, ...existingSessions];
      // Store in localStorage
      localStorage.setItem('recentSessions', JSON.stringify(updatedSessions));
    }

    alert(`Purchase completed! Session Tag: ${sessionTag}\nYour photos will be ready for pickup.`);
    navigate("/photographer", { state: { newSession } });
  };

  const handleLogoClick = () => {
    navigate("/packages", {
      state: { customerName, selectedLocation }
    });
  };

  const getPhotoStyle = (photo: any) => {
    if (!photo.editSettings) return {};
    
    const settings = photo.editSettings;
    const filters = [
      { id: "none", filter: "" },
      { id: "vintage", filter: "sepia(0.7) contrast(1.1) brightness(1.1) saturate(1.2)" },
      { id: "bw", filter: "grayscale(1) contrast(1.1)" },
      { id: "dramatic", filter: "contrast(1.6) brightness(0.8) saturate(0.9)" },
      { id: "warm", filter: "sepia(0.3) saturate(1.4) brightness(1.1)" },
      { id: "cool", filter: "hue-rotate(10deg) saturate(1.3) brightness(1.05)" },
      { id: "sepia", filter: "sepia(1) contrast(1.2) brightness(1.1)" },
      { id: "vivid", filter: "saturate(1.8) contrast(1.2) brightness(1.05)" },
      { id: "soft", filter: "contrast(0.9) brightness(1.2) saturate(1.1)" },
      { id: "noir", filter: "grayscale(1) contrast(1.5) brightness(0.9)" },
      { id: "sunset", filter: "sepia(0.4) saturate(1.3) hue-rotate(-10deg) brightness(1.1)" },
      { id: "arctic", filter: "hue-rotate(180deg) saturate(0.8) brightness(1.2) contrast(1.1)" }
    ];

    const selectedFilterObj = filters.find(f => f.id === settings.selectedFilter);
    const filterStr = selectedFilterObj?.filter || "";
    
    return {
      filter: `${filterStr} brightness(${settings.brightness/100}) contrast(${settings.contrast/100}) saturate(${settings.saturation/100})`,
      transform: `rotate(${settings.rotation || 0}deg)`,
      border: settings.selectedBorder !== "none" ? `${settings.borderThickness || 2}px solid ${settings.borderColor || "#000000"}` : "none"
    };
  };

  const handlePrint = () => {
    if (!allPhotos || allPhotos.length === 0) {
      alert("No photos to print");
      return;
    }

    // Get selected size for print ratio
    const selectedSize = editSettings?.selectedSize || "4x6";
    const sizeRatios = {
      "4x6": { width: 4, height: 6 },
      "6x8": { width: 6, height: 8 },
      "8x10": { width: 8, height: 10 },
      "custom": { width: 8, height: 10 }
    };
    
    const ratio = sizeRatios[selectedSize] || sizeRatios["4x6"];
    
    // Create print content for individual photos
    const printContent = `
      <html>
        <head>
          <title>Photo Prints</title>
          <style>
            @media print {
              @page { 
                margin: 0;
                size: letter;
              }
              body { 
                margin: 0; 
                padding: 0;
                background: white;
              }
              .photo-page {
                page-break-after: always;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                width: 100vw;
              }
              .photo-page:last-child {
                page-break-after: auto;
              }
              .photo-container {
                width: ${ratio.width}in;
                height: ${ratio.height}in;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .photo-container img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
            }
            @media screen {
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: #f5f5f5;
              }
              .photo-page {
                background: white;
                margin-bottom: 20px;
                padding: 20px;
                border: 1px solid #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 500px;
              }
              .photo-container {
                width: 300px;
                height: 450px;
                border: 2px solid #333;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .photo-container img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
            }
          </style>
        </head>
        <body>
          ${allPhotos.map((photo: any, index: number) => {
            const photoStyle = getPhotoStyle(photo);
            const styleString = `
              filter: ${photoStyle.filter || 'none'};
              transform: ${photoStyle.transform || 'none'};
              border: ${photoStyle.border || 'none'};
            `;
            
            return `
              <div class="photo-page">
                <div class="photo-container">
                  <img src="${photo.url}" alt="Photo ${index + 1}" style="${styleString}" />
                </div>
              </div>
            `;
          }).join('')}
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Auto-print after a short delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  };

  const handlePreview = () => {
    // Create a new window for preview
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Photo Preview - ${customerName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .photo { margin: 10px; border: 1px solid #ccc; padding: 10px; display: inline-block; }
              .photo img { max-width: 300px; max-height: 300px; }
              .header { text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>SnapStation Photo Preview</h1>
              <h2>Customer: ${customerName}</h2>
              <h3>Location: ${selectedLocation}</h3>
              <h3>Package: ${currentPackage.name}</h3>
            </div>
            ${allPhotos?.map((photo: any, index: number) => {
              const photoStyle = getPhotoStyle(photo);
              const styleString = `
                filter: ${photoStyle.filter || 'none'};
                transform: ${photoStyle.transform || 'none'};
                border: ${photoStyle.border || 'none'};
              `;
              
              return `
                <div class="photo">
                  <h4>Photo ${index + 1}</h4>
                  <img src="${photo.url}" alt="Photo ${index + 1}" style="${styleString}" />
                </div>
              `;
            }).join('') || ''}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 border-b border-blue-500 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/packages", { state: { customerName, selectedLocation } })}
          className="text-gray-600"
        >
          ← Back to Packages
        </Button>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Your Cart</h1>
          </div>
          <p className="text-gray-600">Review your photos and complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle>{currentPackage.name}</CardTitle>
                  <Badge>₹{currentPackage.price}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Photos:</span>
                    <span className="font-medium">{allPhotos?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedLocation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Photos ({allPhotos?.length || 0})</CardTitle>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePreview}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {allPhotos && allPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {allPhotos.map((photo: any, index: number) => (
                      <div key={photo.id} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={photo.url} 
                            alt={`Photo ${index + 1}`} 
                            className="w-full h-full object-cover"
                            style={getPhotoStyle(photo)}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium">Photo {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No photos selected</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Information */}
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Photographer:</span>
                    <span className="font-medium">Professional Staff</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package ({currentPackage.name}):</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">₹{tax}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    onClick={handleCompletePurchase}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete Purchase
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/editor", { 
                      state: { 
                        selectedPackage, 
                        allPhotos, 
                        customerName, 
                        selectedLocation,
                        currentPhoto: allPhotos?.[0]
                      } 
                    })}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Editor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
