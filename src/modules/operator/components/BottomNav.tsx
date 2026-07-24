import {Home, BarChart3, History, UserCheck, User} from "lucide-react";

import {useNavigate, useLocation} from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      label: "Home",
      icon: Home,
      path: "/operator/dashboard",
    },
    {
      label: "Stats",
      icon: BarChart3,
      path: "/operator/analytics",
    },
    {
      label: "Status",
      icon: UserCheck,
      path: "/operator/availability",
    },
    {
      label: "Profile",
      icon: User,
      path: "/operator/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
      <div className="grid grid-cols-4 h-16">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <button
              key={menu.path}
              onClick={() => navigate(menu.path)}
              className={`flex flex-col items-center justify-center text-xs
                ${
                  location.pathname === menu.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {menu.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
