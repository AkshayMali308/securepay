import { useEffect, useState } from "react";
import { getAdminTransactions, flagTransaction } from "../../api/adminApi";
import Badge from "../../components/ui/Badge";
import { FlagIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [flaggingId, setFlaggingId]     = useState(null);
  const [filters, setFilters]           = useState({ status: "", flagged: "" });

  const load = (f = filters) => {
    setLoading(true);
    const params = { limit: 50 };
    if (f.status)  params.status  = f.status;
    if (f.flagged !== "") params.flagged = f.flagged;
    getAdminTransactions(params)
      .then((r) => { setTransactions(r.data.data.transactions); setTotal(r.data.data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const applyFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    load(next);
  };

  const handleFlag = async (id) => {
    const reason = window.prompt("Enter reason for flagging this transaction:");
    if (!reason) return;
    setFlaggingId(id);
    try {
      await flagTransaction(id, reason);
      load();
    } finally {
      setFlaggingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
          <p className="text-gray-500 text-sm">{total} total records</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["", "success", "failed", "pending"].map((s) => (
          <button
            key={s}
            onClick={() => applyFilter("status", s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filters.status === s
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {s || "All Status"}
          </button>
        ))}
        <button
          onClick={() => applyFilter("flagged", filters.flagged === "true" ? "" : "true")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filters.flagged === "true"
              ? "bg-orange-500 text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          <FlagIcon className="w-3.5 h-3.5" /> Flagged Only
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {["Reference", "Sender", "Receiver", "Amount", "Type", "Status", "Flagged", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr
                  key={txn._id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                    txn.flagged ? "bg-orange-50/50 dark:bg-orange-900/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {txn.referenceId}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                      {txn.senderId?.fullName || "—"}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[120px]">
                      {txn.senderId?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {txn.receiverId ? (
                      <>
                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                          {txn.receiverId?.fullName}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">
                          {txn.receiverId?.email}
                        </p>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-300">{txn.type}</td>
                  <td className="px-4 py-3">
                    <Badge label={txn.status} variant={txn.status} />
                  </td>
                  <td className="px-4 py-3">
                    {txn.flagged ? (
                      <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-medium">
                        <FlagIcon className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!txn.flagged && (
                      <button
                        onClick={() => handleFlag(txn._id)}
                        disabled={flaggingId === txn._id}
                        className="px-3 py-1 text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {flaggingId === txn._id ? "..." : "Flag"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
