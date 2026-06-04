import Badge from "../ui/Badge";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const typeConfig = {
  transfer_sent:     { icon: ArrowUpIcon,   color: "text-red-500",   bg: "bg-red-50 dark:bg-red-900/20" },
  transfer_received: { icon: ArrowDownIcon, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  deposit:           { icon: ArrowDownIcon, color: "text-blue-500",  bg: "bg-blue-50 dark:bg-blue-900/20" },
  withdrawal:        { icon: ArrowUpIcon,   color: "text-orange-500",bg: "bg-orange-50 dark:bg-orange-900/20" },
};

const TransactionCard = ({ txn, currentUserId }) => {
  const isSent = (txn.senderId?._id || txn.senderId) === currentUserId;
  const displayType =
    txn.type === "transfer" ? (isSent ? "transfer_sent" : "transfer_received") : txn.type;
  const { icon: Icon, color, bg } = typeConfig[displayType] || typeConfig.deposit;
  const counterparty = isSent ? txn.receiverId : txn.senderId;

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {txn.type === "transfer"
            ? isSent
              ? `To ${counterparty?.fullName || "Unknown"}`
              : `From ${counterparty?.fullName || "Unknown"}`
            : txn.type === "deposit"
            ? "Money Added"
            : "Withdrawal"}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {txn.referenceId} · {formatDate(txn.createdAt)}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-semibold ${isSent && txn.type === "transfer" ? "text-red-600" : "text-green-600"}`}>
          {isSent && txn.type === "transfer" ? "-" : "+"}{formatCurrency(txn.amount)}
        </p>
        <Badge label={txn.status} variant={txn.status} />
      </div>
    </div>
  );
};

export default TransactionCard;
