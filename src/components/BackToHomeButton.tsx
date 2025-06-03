
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const BackToHomeButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/")}
      variant="outline"
      size="sm"
      className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 border-gray-600 text-white"
    >
      <Home className="w-4 h-4 ml-2" />
      العودة للرئيسية
    </Button>
  );
};
