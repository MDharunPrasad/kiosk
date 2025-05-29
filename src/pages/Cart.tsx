import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ShoppingCart, CheckCircle, Printer, Eye, User, ArrowLeft, Receipt } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

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
    const currentDate = new Date();
    const dateStr = currentDate.toISOString().split('T')[0];
    const timeStr = currentDate.toTimeString().split(' ')[0].substring(0, 5);
    const sessionTag = `SS-${dateStr.replace(/-/g, '')}-${timeStr.replace(':', '')}`;
    
    // Create new session object
    const newSession = {
      id: Date.now(),
      customer: customerName,
      location: selectedLocation,
      photos: allPhotos?.length || 0,
      date: dateStr,
      time: timeStr,
      tag: sessionTag,
      status: "Completed",
      revenue: currentPackage.price
    };
    
    const existingSessions = JSON.parse(localStorage.getItem('recentSessions') || '[]');
    
    // Check if a session with the same tag already exists
    const isDuplicate = existingSessions.some(session => session.tag === newSession.tag);
    
    // Only add the session if it's not a duplicate
    if (!isDuplicate) {
      const updatedSessions = [newSession, ...existingSessions];
      // Store in localStorage
      localStorage.setItem('recentSessions', JSON.stringify(updatedSessions));
    }

    // Create a custom alert dialog with styled session tag
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
    alertDiv.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="text-center mb-4">
          <div class="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-2">Purchase Completed!</h3>
        </div>
        <p class="mb-3 text-center">Your photos will be ready for pickup.</p>
        <div class="text-center mb-6">
          <p class="mb-2">Session Tag:</p> 
          <span class="bg-green-500 text-white px-3 py-2 rounded font-medium text-lg">${sessionTag}</span>
        </div>
        <div class="text-sm text-gray-600 mb-6 text-center">Please save this tag to retrieve your photos later</div>
        <div class="grid grid-cols-2 gap-4">
          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" id="generate-invoice">
            Generate Invoice
          </button>
          <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded" id="close-dialog">
            Finish
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Add event listener to close button
    alertDiv.querySelector('#close-dialog')?.addEventListener('click', () => {
      document.body.removeChild(alertDiv);
      navigate("/photographer", { state: { newSession } });
    });

    // Add event listener to generate invoice button
    alertDiv.querySelector('#generate-invoice')?.addEventListener('click', () => {
      generateInvoice();
    });
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
    if (!allPhotos || allPhotos.length === 0) {
      alert("No photos to preview");
      return;
    }

    // Create a new window for preview with improved styling
    const previewWindow = window.open('', '_blank', 'width=1000,height=800');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Photo Preview - ${customerName}</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                margin: 0; 
                padding: 0;
                background-color: #f8fafc;
                color: #1e293b;
              }
              .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
              }
              .header { 
                text-align: center; 
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e2e8f0;
              }
              .header h1 {
                color: #3b82f6;
                margin-bottom: 0.5rem;
              }
              .customer-info {
                display: flex;
                justify-content: space-between;
                background-color: #f1f5f9;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 2rem;
              }
              .customer-info div {
                display: flex;
                flex-direction: column;
              }
              .customer-info span:first-child {
                font-weight: 500;
                color: #64748b;
                font-size: 0.875rem;
              }
              .customer-info span:last-child {
                font-weight: 600;
                font-size: 1rem;
              }
              .gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
              }
              .photo-card {
                background: white;
                border-radius: 0.5rem;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              .photo-card .photo-header {
                padding: 0.75rem 1rem;
                border-bottom: 1px solid #e2e8f0;
                font-weight: 500;
              }
              .photo-container {
                height: 300px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
              }
              .photo-container img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
              .photo-footer {
                padding: 0.75rem 1rem;
                border-top: 1px solid #e2e8f0;
                font-size: 0.875rem;
                color: #64748b;
              }
              .print-button {
                display: block;
                margin: 2rem auto;
                padding: 0.75rem 1.5rem;
                background-color: #3b82f6;
                color: white;
                border: none;
                border-radius: 0.375rem;
                font-weight: 500;
                cursor: pointer;
                font-size: 1rem;
              }
              .print-button:hover {
                background-color: #2563eb;
              }
              @media print {
                .print-button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>SnapStation Photo Preview</h1>
                <p>These are the photos selected for your order</p>
              </div>
              
              <div class="customer-info">
                <div>
                  <span>Customer</span>
                  <span>${customerName}</span>
                </div>
                <div>
                  <span>Location</span>
                  <span>${selectedLocation}</span>
                </div>
                <div>
                  <span>Package</span>
                  <span>${currentPackage.name}</span>
                </div>
                <div>
                  <span>Photos</span>
                  <span>${allPhotos.length}</span>
                </div>
              </div>
              
              <div class="gallery">
                ${allPhotos.map((photo, index) => {
                  const photoStyle = getPhotoStyle(photo);
                  const styleString = `
                    filter: ${photoStyle.filter || 'none'};
                    transform: ${photoStyle.transform || 'none'};
                    border: ${photoStyle.border || 'none'};
                  `;
                  
                  return `
                    <div class="photo-card">
                      <div class="photo-header">Photo ${index + 1}</div>
                      <div class="photo-container">
                        <img src="${photo.url}" alt="Photo ${index + 1}" style="${styleString}" />
                      </div>
                      <div class="photo-footer">
                        ${photo.editSettings?.selectedSize ? `Size: ${photo.editSettings.selectedSize}` : ''}
                        ${photo.editSettings?.selectedFilter ? ` • Filter: ${photo.editSettings.selectedFilter}` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
              
              <button class="print-button" onclick="window.print()">Print Preview</button>
            </div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const generateInvoice = () => {
    if (!allPhotos || allPhotos.length === 0) {
      alert("No photos to include in invoice");
      return;
    }

    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
    const invoiceDate = new Date().toISOString().split('T')[0];
    const invoiceWindow = window.open('', '_blank', 'width=1000,height=800');
    
    if (invoiceWindow) {
      invoiceWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoiceId} - SnapStation</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                margin: 0; 
                padding: 0;
                background-color: #f8fafc;
                color: #1e293b;
              }
              .invoice-container {
                max-width: 800px;
                margin: 2rem auto;
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                overflow: hidden;
              }
              .invoice-header {
                padding: 2rem;
                background-color: #3b82f6;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .logo {
                font-size: 1.5rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              }
              .invoice-info {
                text-align: right;
              }
              .invoice-info h2 {
                margin: 0;
                font-size: 1.25rem;
              }
              .invoice-info p {
                margin: 0.25rem 0 0 0;
                opacity: 0.9;
              }
              .invoice-meta {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
              }
              .customer-details, .invoice-details {
                flex: 1;
              }
              .invoice-details {
                text-align: right;
              }
              .meta-title {
                font-weight: 600;
                color: #64748b;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
                text-transform: uppercase;
              }
              .meta-value {
                font-weight: 500;
                font-size: 1rem;
              }
              .invoice-items {
                padding: 2rem;
              }
              .invoice-title {
                font-size: 1.125rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #1e293b;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th {
                text-align: left;
                padding: 0.75rem;
                font-weight: 500;
                font-size: 0.875rem;
                color: #64748b;
                background-color: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
              }
              td {
                padding: 0.75rem;
                border-bottom: 1px solid #e2e8f0;
              }
              .qty {
                text-align: center;
              }
              .price, .total {
                text-align: right;
              }
              .item-name {
                font-weight: 500;
              }
              .item-description {
                font-size: 0.875rem;
                color: #64748b;
              }
              .invoice-summary {
                margin-top: 2rem;
                display: flex;
                justify-content: flex-end;
              }
              .summary-table {
                width: 300px;
              }
              .summary-table td {
                padding: 0.5rem;
                border: none;
              }
              .summary-table .summary-title {
                font-weight: 500;
              }
              .summary-table .summary-value {
                text-align: right;
                font-weight: 500;
              }
              .summary-table .total-row {
                font-weight: 600;
                font-size: 1.125rem;
                border-top: 1px solid #e2e8f0;
                padding-top: 0.75rem;
              }
              .invoice-footer {
                padding: 2rem;
                background-color: #f8fafc;
                text-align: center;
                font-size: 0.875rem;
                color: #64748b;
                border-top: 1px solid #e2e8f0;
              }
              .invoice-tag {
                background-color: #10b981;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-weight: 500;
                font-size: 0.875rem;
              }
              .print-btn {
                display: block;
                margin: 2rem auto;
                padding: 0.75rem 1.5rem;
                background-color: #3b82f6;
                color: white;
                border: none;
                border-radius: 0.375rem;
                font-weight: 500;
                cursor: pointer;
                font-size: 1rem;
              }
              .print-btn:hover {
                background-color: #2563eb;
              }
              @media print {
                body {
                  background-color: white;
                }
                .invoice-container {
                  box-shadow: none;
                  margin: 0;
                  max-width: none;
                }
                .print-btn {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <div class="logo">
                  <span>📸</span> SnapStation
                </div>
                <div class="invoice-info">
                  <h2>INVOICE</h2>
                  <p>#${invoiceId}</p>
                </div>
              </div>
              
              <div class="invoice-meta">
                <div class="customer-details">
                  <div class="meta-title">Bill To</div>
                  <div class="meta-value">${customerName}</div>
                  <div>Location: ${selectedLocation}</div>
                  <div class="meta-title" style="margin-top: 1rem;">Session Tag</div>
                  <div><span class="invoice-tag">SS-${invoiceDate.replace(/-/g, '')}-${new Date().getHours()}${new Date().getMinutes()}</span></div>
                </div>
                <div class="invoice-details">
                  <div class="meta-title">Invoice Date</div>
                  <div class="meta-value">${invoiceDate}</div>
                  <div class="meta-title" style="margin-top: 1rem;">Status</div>
                  <div class="meta-value" style="color: #10b981">Paid</div>
                </div>
              </div>
              
              <div class="invoice-items">
                <div class="invoice-title">Invoice Items</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 50%">Item</th>
                      <th class="qty">Qty</th>
                      <th class="price">Price</th>
                      <th class="total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="item-name">${currentPackage.name}</div>
                        <div class="item-description">Photo package with professional editing</div>
                      </td>
                      <td class="qty">1</td>
                      <td class="price">₹${subtotal}</td>
                      <td class="total">₹${subtotal}</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="item-name">Photos</div>
                        <div class="item-description">High-quality professional photos</div>
                      </td>
                      <td class="qty">${allPhotos.length}</td>
                      <td class="price">Included</td>
                      <td class="total">-</td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="invoice-summary">
                  <table class="summary-table">
                    <tr>
                      <td class="summary-title">Subtotal</td>
                      <td class="summary-value">₹${subtotal}</td>
                    </tr>
                    <tr>
                      <td class="summary-title">GST (18%)</td>
                      <td class="summary-value">₹${tax}</td>
                    </tr>
                    <tr class="total-row">
                      <td class="summary-title">Total</td>
                      <td class="summary-value">₹${total}</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <div class="invoice-footer">
                Thank you for visiting SnapStation! We hope you enjoy your photos.
              </div>
            </div>
            
            <button class="print-btn" onclick="window.print()">Print Invoice</button>
          </body>
        </html>
      `);
      invoiceWindow.document.close();
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
        <BackButton 
          to="/packages" 
          state={{ customerName, selectedLocation }}
          label="Back to Packages" 
        />
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
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={generateInvoice}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Generate Invoice
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
