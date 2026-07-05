import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchWallet } from "../features/wallet/walletSlice";
import { transferMoney } from "../api/walletApi";
import { searchUsers } from "../api/userApi";
import { useDebounce } from "../hooks/useDebounce";
import { CheckCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/formatCurrency";

const TransferPage = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchUsers(debouncedQuery)
        .then((r) => setResults(r.data.data.users))
        .catch(() => setResults([]));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleTransfer = async () => {
    if (!selected || !amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await transferMoney({
        receiverIdentifier: selected.email,
        amount: parseFloat(amount),
        note,
      });
      setSuccess(res.data.data.transaction);
      dispatch(fetchWallet());
      setSelected(null);
      setAmount("");
      setNote("");
      setQuery("");
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transfer Successful!</h2>
        <p className="text-gray-500 text-sm mb-2">
          Reference: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{success.referenceId}</span>
        </p>
        <p className="text-4xl font-bold text-green-600 mb-8">{formatCurrency(success.amount)}</p>
        <button
          onClick={() => setSuccess(null)}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          New Transfer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Send Money</h1>
        <p className="text-gray-500 text-sm mt-1">Transfer funds instantly to any SecurePay user</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">
        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recipient
          </label>
          {selected ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{selected.fullName}</p>
                <p className="text-xs text-gray-500">{selected.email}</p>
              </div>
              <button
                onClick={() => { setSelected(null); setQuery(""); }}
                className="text-blue-600 text-xs hover:underline font-medium"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Search by email or username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {results.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 z-10 overflow-hidden">
                  {results.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => { setSelected(u); setQuery(""); setResults([]); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-600 text-left transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm flex-shrink-0">
                        {u.fullName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{u.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 5000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
              >
                ₹{v}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Note (optional)
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleTransfer}
          disabled={loading || !selected || !amount || parseFloat(amount) <= 0}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : `Send ${amount ? formatCurrency(parseFloat(amount)) : "₹0"}`}
        </button>
      </div>
    </div>
  );
};

export default TransferPage;
