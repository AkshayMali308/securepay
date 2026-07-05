import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getTransactions, exportTransactions } from "../api/transactionApi";
import TransactionCard from "../components/shared/TransactionCard";
import { ArrowDownTrayIcon, ClockIcon } from "@heroicons/react/24/outline";

const TYPES = ["", "transfer", "deposit", "withdrawal"];
const STATUSES = ["", "success", "failed", "pending"];

const TransactionsPage = () => {
  const { user } = useSelector((s) => s.auth);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ type: "", status: "", page: 1 });

  useEffect(() => {
    setLoading(true);
    getTransactions({ ...filters, limit: 10 })
      .then((r) => {
        setTxns(r.data.data.transactions);
        setPagination(r.data.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleExport = async () => {
    try {
      const res = await exportTransactions();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  };

  const setFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 text-sm">{pagination.total} total records</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter("type", t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filters.type === t
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
            }`}
          >
            {t || "All Types"}
          </button>
        ))}
        {STATUSES.filter(Boolean).map((s) => (
          <button
            key={s}
            onClick={() => setFilter("status", filters.status === s ? "" : s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filters.status === s
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))
        ) : txns.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting the filters above</p>
          </div>
        ) : (
          txns.map((txn) => (
            <TransactionCard key={txn._id} txn={txn} currentUserId={user?._id} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilters((f) => ({ ...f, page: p }))}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                pagination.page === p
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
