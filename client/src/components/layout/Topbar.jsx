import { useSelector } from "react-redux";
import { Bars3Icon, SunIcon, MoonIcon, BellIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

const Topbar = ({ onMenuToggle }) => {
  const { user } = useSelector((s) => s.auth);
  const { wallet } = useSelector((s) => s.wallet);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <button className="md:hidden p-1" onClick={onMenuToggle}>
        <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
      <div className="hidden md:block">
        <p className="text-xs text-gray-400">Welcome back,</p>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.fullName}</p>
      </div>
      <div className="flex items-center gap-3">
        {wallet && (
          <div className="hidden sm:flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Balance</span>
            <span className="font-bold text-blue-700 dark:text-blue-300 font-mono text-sm">
              {formatCurrency(wallet.balance)}
            </span>
          </div>
        )}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setDark((d) => !d)}
        >
          {dark
            ? <SunIcon className="w-5 h-5 text-yellow-400" />
            : <MoonIcon className="w-5 h-5 text-gray-600" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          {user?.fullName?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
