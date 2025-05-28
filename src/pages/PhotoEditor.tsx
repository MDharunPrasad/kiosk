
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Settings, Image, Square, Maximize, RotateCcw, RotateCw, Crop, Sun, Palette, Upload, ArrowLeft, ArrowRight } from "lucide-react";

const PhotoEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPackage, currentPhoto, allPhotos, customerName, selectedLocation } = location.state || {};
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(
    allPhotos?.findIndex((p: any) => p.id === currentPhoto?.id) || 0
  );
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [activeTab, setActiveTab] = useState("filters");
  const [selectedSize, setSelectedSize] = useState("4x6");
  const [selectedBorder, setSelectedBorder] = useState("none");
  const [borderThickness, setBorderThickness] = useState(2);
  const [borderColor, setBorderColor] = useState("#000000");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [cropMode, setCropMode] = useState(false);

  const currentPhotoData = allPhotos?.[currentPhotoIndex] || currentPhoto;

  const filters = [
    { id: "none", name: "None", preview: "bg-gray-200", filter: "" },
    { id: "vintage", name: "Vintage", preview: "bg-yellow-200", filter: "sepia(0.7) contrast(1.1) brightness(1.1) saturate(1.2)" },
    { id: "bw", name: "B&W", preview: "bg-gray-400", filter: "grayscale(1) contrast(1.1)" },
    { id: "dramatic", name: "Dramatic", preview: "bg-gray-600", filter: "contrast(1.6) brightness(0.8) saturate(0.9)" },
    { id: "warm", name: "Warm", preview: "bg-orange-200", filter: "sepia(0.3) saturate(1.4) brightness(1.1)" },
    { id: "cool", name: "Cool", preview: "bg-blue-200", filter: "hue-rotate(10deg) saturate(1.3) brightness(1.05)" },
    { id: "sepia", name: "Sepia", preview: "bg-amber-200", filter: "sepia(1) contrast(1.2) brightness(1.1)" },
    { id: "vivid", name: "Vivid", preview: "bg-pink-200", filter: "saturate(1.8) contrast(1.2) brightness(1.05)" },
    { id: "soft", name: "Soft", preview: "bg-purple-200", filter: "contrast(0.9) brightness(1.2) saturate(1.1)" },
    { id: "noir", name: "Noir", preview: "bg-black", filter: "grayscale(1) contrast(1.5) brightness(0.9)" },
    { id: "sunset", name: "Sunset", preview: "bg-red-200", filter: "sepia(0.4) saturate(1.3) hue-rotate(-10deg) brightness(1.1)" },
    { id: "arctic", name: "Arctic", preview: "bg-cyan-200", filter: "hue-rotate(180deg) saturate(0.8) brightness(1.2) contrast(1.1)" }
  ];

  const customSizes = [
    { id: "4x6", name: "4x6 inches", price: "₹50" },
    { id: "6x8", name: "6x8 inches", price: "₹80" },
    { id: "8x10", name: "8x10 inches", price: "₹120" },
    { id: "custom", name: "Custom Size", price: "₹150" }
  ];

  const borderStyles = [
    { id: "none", name: "None" },
    { id: "solid", name: "Solid" },
    { id: "vintage", name: "Vintage" },
    { id: "modern", name: "Modern" }
  ];

  const getFilterStyle = () => {
    const selectedFilterObj = filters.find(f => f.id === selectedFilter);
    const filterStr = selectedFilterObj?.filter || "";
    return {
      filter: `${filterStr} brightness(${brightness/100}) contrast(${contrast/100}) saturate(${saturation/100})`,
      transform: `rotate(${rotation}deg)`,
      border: selectedBorder !== "none" ? `${borderThickness}px solid ${borderColor}` : "none"
    };
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const handleCrop = () => {
    setCropMode(!cropMode);
    console.log("Crop mode:", !cropMode);
  };

  const handleSaveChanges = () => {
    const editedPhoto = {
      ...currentPhotoData,
      editSettings: {
        selectedFilter,
        selectedSize,
        selectedBorder,
        borderThickness,
        borderColor,
        brightness,
        contrast,
        saturation,
        rotation
      }
    };

    const updatedPhotos = [...allPhotos];
    updatedPhotos[currentPhotoIndex] = editedPhoto;

    navigate("/cart", { 
      state: { 
        selectedPackage,
        allPhotos: updatedPhotos,
        customerName,
        selectedLocation,
        editSettings: {
          selectedFilter,
          selectedSize,
          selectedBorder,
          borderThickness,
          borderColor,
          brightness,
          contrast,
          saturation,
          rotation
        }
      } 
    });
  };

  const handleLogoClick = () => {
    navigate("/packages", {
      state: { customerName, selectedLocation }
    });
  };

  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const goToNextPhoto = () => {
    if (currentPhotoIndex < allPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/packages", { state: { customerName, selectedLocation } })}
          className="text-gray-600"
        >
          ← Back to Packages
        </Button>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Photo Editor</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Editing photo {currentPhotoIndex + 1} of {allPhotos?.length || 1} for {customerName}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Photo Preview */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6">
                {/* Photo Navigation */}
                {allPhotos && allPhotos.length > 1 && (
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPhoto}
                      disabled={currentPhotoIndex === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      {currentPhotoIndex + 1} / {allPhotos.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPhoto}
                      disabled={currentPhotoIndex === allPhotos.length - 1}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}

                <div className="aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  {currentPhotoData ? (
                    <img 
                      src={currentPhotoData.url} 
                      alt="Editing photo" 
                      className="w-full h-full object-cover"
                      style={getFilterStyle()}
                    />
                  ) : (
                    <div className="text-center p-8">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No photo selected</p>
                    </div>
                  )}
                  {cropMode && (
                    <div className="absolute inset-4 border-2 border-dashed border-white bg-black bg-opacity-20">
                      <span className="absolute top-2 left-2 text-white text-sm">Crop Area</span>
                    </div>
                  )}
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleRotateLeft}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Rotate Left
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleRotateRight}>
                    <RotateCw className="h-4 w-4 mr-1" />
                    Rotate Right
                  </Button>
                  <Button 
                    variant={cropMode ? "default" : "outline"} 
                    size="sm" 
                    className="w-full sm:w-auto" 
                    onClick={handleCrop}
                  >
                    <Crop className="h-4 w-4 mr-1" />
                    {cropMode ? "Apply Crop" : "Crop"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editing Controls */}
          <div className="space-y-6">
            {/* Editing Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Editing Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-1 mb-4">
                  <Button 
                    variant={activeTab === "filters" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("filters")}
                    className="text-xs sm:text-sm"
                  >
                    <Image className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Filters
                  </Button>
                  <Button 
                    variant={activeTab === "adjust" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("adjust")}
                    className="text-xs sm:text-sm"
                  >
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Adjust
                  </Button>
                  <Button 
                    variant={activeTab === "borders" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("borders")}
                    className="text-xs sm:text-sm"
                  >
                    <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Borders
                  </Button>
                  <Button 
                    variant={activeTab === "size" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("size")}
                    className="text-xs sm:text-sm"
                  >
                    <Maximize className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Size
                  </Button>
                </div>

                {activeTab === "filters" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filters.map((filter) => (
                      <div
                        key={filter.id}
                        className={`cursor-pointer text-center p-2 rounded-lg border-2 transition-all ${
                          selectedFilter === filter.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedFilter(filter.id)}
                      >
                        <div className={`w-full h-6 sm:h-8 ${filter.preview} rounded mb-1`}></div>
                        <span className="text-xs font-medium">{filter.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "adjust" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center">
                        <Sun className="h-4 w-4 mr-1" />
                        Brightness: {brightness}%
                      </label>
                      <input 
                        type="range" 
                        className="w-full" 
                        min="50" 
                        max="150" 
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Contrast: {contrast}%</label>
                      <input 
                        type="range" 
                        className="w-full" 
                        min="50" 
                        max="150" 
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center">
                        <Palette className="h-4 w-4 mr-1" />
                        Saturation: {saturation}%
                      </label>
                      <input 
                        type="range" 
                        className="w-full" 
                        min="50" 
                        max="150" 
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "borders" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {borderStyles.map((border) => (
                        <div 
                          key={border.id}
                          className={`p-3 border-2 rounded-lg text-center cursor-pointer hover:border-blue-500 ${
                            selectedBorder === border.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedBorder(border.id)}
                        >
                          <div className={`w-full h-6 sm:h-8 bg-white rounded mb-2 ${
                            border.id !== "none" ? `border-2 border-gray-400` : ""
                          }`}></div>
                          <span className="text-xs">{border.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    {selectedBorder !== "none" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Border Thickness: {borderThickness}px
                          </label>
                          <input 
                            type="range" 
                            className="w-full" 
                            min="1" 
                            max="20" 
                            value={borderThickness}
                            onChange={(e) => setBorderThickness(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Border Color</label>
                          <input 
                            type="color" 
                            className="w-full h-10 rounded border border-gray-300" 
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "size" && (
                  <div className="space-y-2">
                    {customSizes.map((size) => (
                      <div 
                        key={size.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer hover:border-blue-500 ${
                          selectedSize === size.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedSize(size.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{size.name}</span>
                          <Badge variant="secondary">{size.price}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSaveChanges}
              >
                Save & Continue to Cart
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/packages", { state: { customerName, selectedLocation } })}
              >
                Back to Photos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
