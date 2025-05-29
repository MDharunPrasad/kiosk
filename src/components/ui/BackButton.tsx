import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  state?: any;
  label?: string;
}

const BackButton = ({ to, state, label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (to) {
      navigate(to, { state });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleBack}
        className="text-gray-600 hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {label}
      </Button>
    </div>
  );
};

export default BackButton;