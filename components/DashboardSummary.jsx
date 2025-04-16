import { motion } from "framer-motion";
import { format } from "date-fns";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";

export default function DashboardSummary({ transactions = [] }) {
  // Add null check and default empty array
  if (!transactions || transactions.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-gray-500">$0.00</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Top Categories
          </h3>
          <p className="text-gray-500">No expenses yet</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Recent Expenses
          </h3>
          <p className="text-gray-500">No recent transactions</p>
        </motion.div>
      </div>
    );
  }

  // Calculate total expenses (only considering negative amounts)
  const totalExpenses = transactions.reduce(
    (sum, t) => sum + (Number(t.amount) < 0 ? Math.abs(Number(t.amount)) : 0),
    0
  );

  // Calculate category breakdown (only for expenses)
  const categoryExpenses = transactions.reduce((acc, t) => {
    if (Number(t.amount) < 0) {
      const category = t.category;
      acc[category] = (acc[category] || 0) + Math.abs(Number(t.amount));
    }
    return acc;
  }, {});

  // Get recent transactions (last 3 expenses)
  const recentTransactions = [...transactions]
    .filter((t) => Number(t.amount) < 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Expenses Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Total Expenses
        </h3>
        <p className="text-2xl font-bold text-red-500">
          ${totalExpenses.toFixed(2)}
        </p>
      </motion.div>

      {/* Category Breakdown Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Top Categories
        </h3>
        <div className="space-y-2">
          {Object.entries(categoryExpenses)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  {category}
                </span>
                <span className="text-red-500 font-semibold">
                  ${amount.toFixed(2)}
                </span>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Recent Transactions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Recent Expenses
        </h3>
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </p>
                </div>
                <span className="text-sm font-semibold text-red-500">
                  ${Math.abs(Number(transaction.amount)).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent expenses</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
