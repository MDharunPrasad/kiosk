import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Check, Star, Upload, Image, History, Edit, Trash2 } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const Packages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerName, selectedLocation } = location.state || {};
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{id: string, url: string, name: string}>>([]);
  const [activeTab, setActiveTab] = useState("bundles");

  const packages = [
    {
      id: "basic",
      name: "Basic Pack",
      price: "₹50",
      photos: "2 Photos",
      maxPhotos: 2,
      features: [
        "2 professional photos",
        "Digital copies available", 
        "Basic editing included"
      ],
      description: "Simple package for quick memories",
      icon: Camera,
      color: "blue"
    },
    {
      id: "standard", 
      name: "Standard Pack",
      price: "₹250",
      photos: "5 photos",
      maxPhotos: 5,
      features: [
        "5 professional photos",
        "Digital copies included",
        "Enhanced editing options",
        "One location of your choice"
      ],
      description: "Popular choice with great value",
      icon: Camera,
      color: "blue",
      popular: true
    },
    {
      id: "premium",
      name: "Premium Pack", 
      price: "₹500",
      photos: "10 Photos",
      maxPhotos: 10,
      features: [
        "10 professional photos",
        "High resolution digital copies",
        "Full editing capabilities",
        "Two locations of your choice"
      ],
      description: "Great value for more memories",
      icon: Camera,
      color: "blue"
    },
    {
      id: "unlimited",
      name: "Unlimited Pack",
      price: "₹999", 
      photos: "Unlimited Photos",
      maxPhotos: 50, // reasonable limit for UI
      features: [
        "Unlimited photos",
        "4K resolution digital copies",
        "Advanced editing features",
        "Multiple locations",
        "Priority processing"
      ],
      description: "Ultimate experience with no limits",
      icon: Star,
      color: "purple"
    }
  ];

  const getCurrentPackage = () => packages.find(pkg => pkg.id === selectedPackage) || packages[1];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentPackage = getCurrentPackage();
    const remainingSlots = currentPackage.maxPhotos - uploadedPhotos.length;
    
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more photos for this package`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now().toString() + Math.random().toString(),
          url: e.target?.result as string,
          name: file.name
        };
        setUploadedPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleEditPhoto = (photo: {id: string, url: string, name: string}) => {
    navigate("/editor", { 
      state: { 
        selectedPackage,
        currentPhoto: photo,
        allPhotos: uploadedPhotos,
        customerName,
        selectedLocation
      } 
    });
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setActiveTab("upload");
  };

  const handleProceedToCart = () => {
    if (uploadedPhotos.length === 0) {
      alert("Please upload at least one photo");
      return;
    }
    
    navigate("/cart", { 
      state: { 
        selectedPackage,
        uploadedPhotos,
        customerName,
        selectedLocation
      } 
    });
  };

  const handleLogoClick = () => {
    navigate("/photographer");
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
              onClick={() => navigate("/new-session")}
            >
              Back
            </Button>
          </div>
        </div>
      </header>

      <BackButton 
        to="/new-session" 
        state={{ customerName, selectedLocation }} 
        label="Back to New Session" 
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Photo Session for {customerName}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Location: {selectedLocation} • Select your bundle and upload photos
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button 
              variant={activeTab === "bundles" ? "default" : "ghost"}
              onClick={() => setActiveTab("bundles")}
              className="px-4 sm:px-6"
            >
              <Camera className="h-4 w-4 mr-2" />
              Select Bundle
            </Button>
            <Button 
              variant={activeTab === "upload" ? "default" : "ghost"}
              onClick={() => setActiveTab("upload")}
              className="px-4 sm:px-6"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
            <Button 
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
              className="px-4 sm:px-6"
            >
              <History className="h-4 w-4 mr-2" />
              Upload History
            </Button>
          </div>
        </div>

        {activeTab === "bundles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {packages.map((pkg) => {
              const IconComponent = pkg.icon;
              const isSelected = selectedPackage === pkg.id;
              
              return (
                <Card 
                  key={pkg.id} 
                  className={`relative cursor-pointer transition-all hover:shadow-xl ${
                    isSelected ? 'ring-3 ring-blue-500 shadow-xl' : ''
                  } ${pkg.popular ? 'border-blue-500 shadow-lg' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-8">
                    <div className={`mx-auto mb-5 w-16 h-16 bg-${pkg.color}-100 rounded-full flex items-center justify-center`}>
                      <IconComponent className={`h-8 w-8 text-${pkg.color}-600`} />
                    </div>
                    <CardTitle className={`text-xl sm:text-2xl text-${pkg.color}-600 mb-2`}>
                      {pkg.name}
                    </CardTitle>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                      {pkg.price}
                    </div>
                    <div className={`text-sm font-medium text-${pkg.color}-600 mb-2`}>
                      {pkg.photos}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {pkg.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4 pb-6">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    <div className="pt-6">
                      <Button 
                        className={`w-full py-6 text-lg ${
                          isSelected 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={() => handleSelectPackage(pkg.id)}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-5 w-5 mr-2" />
                            Selected
                          </>
                        ) : (
                          'Select Bundle'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Upload Photos</CardTitle>
                <p className="text-center text-sm text-gray-600">
                  {getCurrentPackage().name} - {uploadedPhotos.length}/{getCurrentPackage().maxPhotos} photos
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Click to upload photos</p>
                  <p className="text-gray-500">Choose photos from your computer</p>
                  <p className="text-sm text-blue-600 mt-2">
                    Remaining slots: {getCurrentPackage().maxPhotos - uploadedPhotos.length}
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {uploadedPhotos.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Uploaded Photos ({uploadedPhotos.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {uploadedPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEditPhoto(photo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemovePhoto(photo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "history" && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Upload History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No upload history available for this session</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center space-y-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            onClick={handleProceedToCart}
            disabled={uploadedPhotos.length === 0}
          >
            Proceed to Cart →
          </Button>
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/new-session")}
              className="text-gray-600 border-gray-300"
            >
              Cancel Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
