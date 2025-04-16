"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import EditTransactionModal from "@/components/EditTransactionModal";
import CategoryPieChart from "@/components/CategoryPieChart";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast.error("Error fetching transactions");
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    const loadingToast = toast.loading(
      editingTransaction ? "Updating transaction..." : "Adding transaction..."
    );

    try {
      if (editingTransaction) {
        const response = await fetch(
          `/api/transactions/${editingTransaction._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: Number(data.amount),
              description: data.description,
              category: data.category,
              date: new Date(data.date),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }

        await fetchTransactions();
        setEditingTransaction(null);
        toast.success("Transaction updated successfully!", {
          id: loadingToast,
        });
      } else {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            amount: Number(data.amount),
            date: new Date(data.date),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add transaction");
        }

        await fetchTransactions();
        toast.success("Transaction added successfully!", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Error saving transaction", { id: loadingToast });
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting transaction...");
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      await fetchTransactions();
      toast.success("Transaction deleted successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error deleting transaction", { id: loadingToast });
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" />
      <AnimatePresence>
        {editingTransaction && (
          <EditTransactionModal
            transaction={editingTransaction}
            onSave={handleSubmit}
            onClose={() => setEditingTransaction(null)}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-gray-800 dark:text-white text-center"
        >
          Personal Finance Visualizer
        </motion.h1>

        {/* Dashboard Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Expenses Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Expenses
            </h3>
            {isLoading ? (
              <div className="h-12 flex items-center">
                <LoadingSpinner />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-2xl font-bold text-gray-400 mt-2">$0.00</p>
            ) : (
              <p className="text-2xl font-bold text-red-500 mt-2">
                $
                {transactions
                  .filter((t) => t.amount > 0) // Only include negative amounts
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0) // Sum up the absolute values
                  .toFixed(2)}
              </p>
            )}
          </motion.div>

          {/* Recent Transactions - Horizontal Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Recent Transactions
              </h3>
              <button
                onClick={() =>
                  document
                    .getElementById("all-transactions")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
              >
                View All →
              </button>
            </div>
            {isLoading ? (
              <div className="h-12 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-gray-500">
                <p>No transactions yet</p>
                <p className="text-sm">
                  Add your first transaction using the form
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {transactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex justify-between items-start bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        transaction.amount < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Charts Side by Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Expenses Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Monthly Expenses
                </h2>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                    <p>No expense data available</p>
                    <p className="text-sm">
                      Add transactions to see monthly trends
                    </p>
                  </div>
                ) : (
                  <ExpenseChart transactions={transactions} />
                )}
              </div>

              {/* Category Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Category Breakdown
                </h2>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                    <p>No category data available</p>
                    <p className="text-sm">
                      Add transactions to see category breakdown
                    </p>
                  </div>
                ) : (
                  <CategoryPieChart transactions={transactions} />
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            {/* Add Transaction Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[492px] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Add Transaction
              </h2>
              <TransactionForm
                onSubmit={handleSubmit}
                initialData={editingTransaction}
              />
            </div>
          </motion.div>
        </div>

        {/* All Transactions Section */}
        <motion.div
          id="all-transactions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            All Transactions
          </h2>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : transactions.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-500">
              <p>No transactions found</p>
              <p className="text-sm">Start by adding your first transaction</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <TransactionList
                transactions={transactions}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}
