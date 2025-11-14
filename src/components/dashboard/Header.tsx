import React, { useState, useEffect, useRef } from "react";
import { Bell, User, Settings, LogOut, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";

interface UserData {
  name: string;
  user_name?: string;
  email: string;
  avatar?: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserData;
        setUserData(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userData");
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async (): Promise<void> => {
    try {
      const toastId = toast.loading("Logging out...");
      const response = await api.post("/admin-auth/signin/logout");
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      
      delete api.defaults.headers.common["Authorization"];

      setIsDropdownOpen(false);

      toast.update(toastId, {
        render: response.data?.message || "Logged out successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/login");
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      delete api.defaults.headers.common["Authorization"];

      setIsDropdownOpen(false);
      toast.info("Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 p-3 sm:p-4 shadow-sm w-full">
      <div className="flex items-center justify-between">
        <div></div>

        {/* Right Section - Notification & Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Notification Icon */}
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              <img
                src={userData?.avatar || "/images/user_icon.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 sm:mt-3 w-64 sm:w-72 md:w-80 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 z-50 overflow-hidden">
                {/* User Info Section */}
                <div className="px-3 sm:px-4 py-3 bg-white">
                  <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <img
                        src={userData?.avatar || "/images/user_icon.png"}
                        alt="avatar"
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-gray-200 object-cover"
                      />
                      <div className="truncate flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg truncate">
                          {userData?.name || "User Name"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {userData?.email || "user@example.com"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1 sm:p-2">
                  <MenuItem
                    icon={<User className="w-4 h-4 text-gray-600" />}
                    label="Profile"
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                  />
                  <MenuItem
                    icon={<Settings className="w-4 h-4 text-gray-600" />}
                    label="Account Settings"
                    onClick={() => {
                      navigate("/settings");
                      setIsDropdownOpen(false);
                    }}
                  />
                  <MenuItem
                    icon={<HelpCircle className="w-4 h-4 text-gray-600" />}
                    label="Help Center"
                    onClick={() => {
                      navigate("/help");
                      setIsDropdownOpen(false);
                    }}
                  />
                  
                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <MenuItem
                    icon={<LogOut className="w-4 h-4 text-red-600" />}
                    label="Sign Out"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${
      danger
        ? "text-red-600 hover:bg-red-50 hover:text-red-700"
        : "hover:bg-gray-100 sm:hover:bg-gray-200"
    }`}
  >
    <div className="flex items-center space-x-2 sm:space-x-3">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium truncate">{label}</span>
    </div>
  </button>
);

export default Header;