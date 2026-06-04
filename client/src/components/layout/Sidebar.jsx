import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import {
  HomeIcon, ArrowsRightLeftIcon, ClockIcon, UserCircleIcon,
  UsersIcon, ShieldCheckIcon, ArrowLeftOnRectangleIcon, XMarkIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Dashboard",    path: "/dashboard",    icon: HomeIcon },
  { label: "Transfer",     path: "/transfer",     icon: ArrowsRightLeftIcon },
  { label: "Transactions", path: "/transactions", icon: ClockIcon },
  { label: "Profile",      path: "/profile",      icon: UserCircleIcon },
];
const adminItems = [
  { label: "Admin Home",   path: "/admin",              icon: ShieldCheckIcon },
  { label: "Users",        path: "/admin/users",        icon: UsersIcon },
  { label: "Transactions", path: "/admin/transactions", icon: ClockIcon },
];

const Sidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside className={`fixed md:static z-30 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">SecurePay</span>
          </div>
          <button className="md:hidden p-1" onClick={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={linkClass} onClick={onClose}>
              <Icon className="w-5 h-5" /> {label}
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </div>
              {adminItems.map(({ label, path, icon: Icon }) => (
                <NavLink key={path} to={path} className={linkClass} onClick={onClose}>
                  <Icon className="w-5 h-5" /> {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
