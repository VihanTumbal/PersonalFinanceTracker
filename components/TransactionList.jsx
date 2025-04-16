import { motion } from "framer-motion";
import { format } from "date-fns";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function TransactionList({ transactions, onDelete, onEdit }) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <motion.div
          key={transaction._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">
              {transaction.description}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {transaction.category} •{" "}
              {format(new Date(transaction.date), "PP")}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`text-lg font-semibold ${
                transaction.amount < 0
                  ? "text-red-500 dark:text-red-400"
                  : "text-green-500 dark:text-green-400"
              }`}
            >
              ${Math.abs(transaction.amount).toFixed(2)}
            </span>
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(transaction._id)}
              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
