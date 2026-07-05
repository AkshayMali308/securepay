import { useEffect, useState } from "react";
import { getAdminUsers, freezeUser, unfreezeUser } from "../../api/adminApi";
import Badge from "../../components/ui/Badge";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebounce } from "../../hooks/useDebounce";

const AdminUsers = () => {
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const load = (q = debouncedSearch) => {
    setLoading(true);
    getAdminUsers({ search: q, limit: 50 })
      .then((r) => { setUsers(r.data.data.users); setTotal(r.data.data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [debouncedSearch]);

  const toggleFreeze = async (user) => {
    setActionId(user._id);
    try {
      if (user.isFrozen) await unfreezeUser(user._id);
      else await freezeUser(user._id);
      load();
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 text-sm">{total} registered users</p>
        </div>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            placeholder="Search name, email, username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {["Name", "Email", "Customer ID", "Role", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.fullName}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[180px] truncate">{u.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{u.customerId}</td>
                  <td className="px-4 py-3">
                    <Badge label={u.role} variant={u.role === "admin" ? "pending" : "default"} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={u.isFrozen ? "Frozen" : "Active"}
                      variant={u.isFrozen ? "failed" : "success"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => toggleFreeze(u)}
                        disabled={actionId === u._id}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          u.isFrozen
                            ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {actionId === u._id ? "..." : u.isFrozen ? "Unfreeze" : "Freeze"}
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

export default AdminUsers;
