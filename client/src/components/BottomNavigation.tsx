import { Link } from "wouter";
import { Building2, History, Settings } from "lucide-react";

interface BottomNavigationProps {
  currentPath: string;
}

const BottomNavigation = ({ currentPath }: BottomNavigationProps) => {
  return (
    <nav className="bg-surface border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around">
          <Link href="/">
            <a className={`flex flex-col items-center py-3 px-6 ${currentPath === "/" ? "text-primary relative" : "text-gray-500"}`}>
              <Building2 className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Calculator</span>
              {currentPath === "/" && (
                <span className="absolute bottom-0 left-1/2 w-10 h-0.5 bg-primary transform -translate-x-1/2"></span>
              )}
            </a>
          </Link>
          
          <Link href="/history">
            <a className={`flex flex-col items-center py-3 px-6 ${currentPath === "/history" ? "text-primary relative" : "text-gray-500"}`}>
              <History className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">History</span>
              {currentPath === "/history" && (
                <span className="absolute bottom-0 left-1/2 w-10 h-0.5 bg-primary transform -translate-x-1/2"></span>
              )}
            </a>
          </Link>
          
          <Link href="/settings">
            <a className={`flex flex-col items-center py-3 px-6 ${currentPath === "/settings" ? "text-primary relative" : "text-gray-500"}`}>
              <Settings className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Settings</span>
              {currentPath === "/settings" && (
                <span className="absolute bottom-0 left-1/2 w-10 h-0.5 bg-primary transform -translate-x-1/2"></span>
              )}
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
