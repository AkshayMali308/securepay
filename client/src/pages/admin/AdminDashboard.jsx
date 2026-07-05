import { useEffect, useState } from "react";
import { getAnalytics } from "../../api/adminApi";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  UsersIcon, CurrencyRupeeIcon, CheckCircleIcon,
  XCircleIcon, FlagIcon, LockClosedIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((r) => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const cards = [
    { title: "Total Users",       value: stats.totalUsers,     icon: UsersIcon,         color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Total Volume",      value: formatCurrency(stats.totalVolume), icon: CurrencyRupeeIcon, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { title: "Successful Txns",   value: stats.successTxn,     icon: CheckCircleIcon,   color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20" },
    { title: "Failed Txns",       value: stats.failedTxn,      icon: XCircleIcon,       color: "text-red-600",    bg: "bg-red-50 dark:bg-red-900/20" },
    { title: "Flagged Txns",      value: stats.flaggedTxn,     icon: FlagIcon,          color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { title: "Frozen Accounts",   value: stats.frozenUsers,    icon: LockClosedIcon,    color: "text-red-600",    bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and analytics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Transaction Summary</h2>
        <div className="space-y-3">
          {[
            { label: "Total Transactions", value: stats.totalTransactions, color: "bg-blue-500" },
            { label: "Successful",         value: stats.successTxn,        color: "bg-green-500" },
            { label: "Failed",             value: stats.failedTxn,         color: "bg-red-500" },
            { label: "Flagged",            value: stats.flaggedTxn,        color: "bg-orange-500" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all`}
                  style={{ width: stats.totalTransactions ? `${Math.min(100, (value / stats.totalTransactions) * 100)}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
