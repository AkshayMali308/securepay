import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWallet } from "../features/wallet/walletSlice";
import { useSocket } from "../hooks/useSocket";
import { formatCurrency } from "../utils/formatCurrency";
import { addMoney } from "../api/walletApi";
import { getTransactions } from "../api/transactionApi";
import TransactionCard from "../components/shared/TransactionCard";
import {
  ArrowsRightLeftIcon, PlusCircleIcon, ClockIcon,
  ArrowDownTrayIcon, ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, sub, colorClass = "text-gray-900 dark:text-white" }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{title}</p>
    <p className={`text-xl font-bold truncate ${colorClass}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>}
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((s) => s.wallet);
  const { user } = useSelector((s) => s.auth);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loadingTxns, setLoadingTxns] = useState(true);
  const [addingMoney, setAddingMoney] = useState(false);

  useSocket(user?._id);

  useEffect(() => {
    dispatch(fetchWallet());
    getTransactions({ limit: 5, page: 1 })
      .then((r) => setRecentTxns(r.data.data.transactions))
      .finally(() => setLoadingTxns(false));
  }, [dispatch]);

  const handleAddDemo = async () => {
    setAddingMoney(true);
    try {
      await addMoney(1000);
      dispatch(fetchWallet());
    } finally {
      setAddingMoney(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance hero card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
        <p className="text-blue-200 text-sm mb-1">Total Balance</p>
        <p className="text-4xl font-bold font-mono">{formatCurrency(wallet?.balance ?? 0)}</p>
        <p className="text-blue-300 text-xs mt-1 font-mono">A/C: {wallet?.accountNumber ?? "—"}</p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link
            to="/transfer"
            className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            <ArrowsRightLeftIcon className="w-4 h-4" /> Transfer
          </Link>
          <button
            onClick={handleAddDemo}
            disabled={addingMoney}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <PlusCircleIcon className="w-4 h-4" />
            {addingMoney ? "Adding..." : "Add ₹1000 (Demo)"}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Customer ID" value={user?.customerId ?? "—"} sub="Your unique ID" />
        <StatCard
          title="Daily Limit"
          value={formatCurrency(wallet?.dailyTransferLimit ?? 50000)}
          sub={`Used: ${formatCurrency(wallet?.dailyTransferUsed ?? 0)}`}
          colorClass="text-blue-600"
        />
        <StatCard
          title="KYC Status"
          value={user?.isVerified ? "Verified" : "Pending"}
          colorClass={user?.isVerified ? "text-green-600" : "text-yellow-600"}
        />
        <StatCard
          title="Account"
          value={wallet?.isActive ? "Active" : "Frozen"}
          colorClass={wallet?.isActive ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          </div>
          <Link to="/transactions" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {loadingTxns ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))
          ) : recentTxns.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm mt-1">Add demo money and make your first transfer</p>
            </div>
          ) : (
            recentTxns.map((txn) => (
              <TransactionCard key={txn._id} txn={txn} currentUserId={user?._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
