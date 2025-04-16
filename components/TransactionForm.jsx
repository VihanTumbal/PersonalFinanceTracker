import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";

const transactionSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Invalid date format"),
});

export default function TransactionForm({ onSubmit, initialData }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData || {
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmitForm = async (data) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset();
      }
    } catch (error) {
      // Error handling is managed in page.js
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500 
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isSubmitting}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <input
          type="text"
          {...register("description")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500 
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Category
        </label>
        <select
          {...register("category")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500 
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isSubmitting}
        >
          <option value="">Select a category</option>
          {TRANSACTION_CATEGORIES.map((category) => (
            <option key={category.id} value={category.label}>
              {category.icon} {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Date
        </label>
        <input
          type="date"
          {...register("date")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500 
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isSubmitting}
        />
        {errors.date && (
          <p className="text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent 
                 shadow-sm text-sm font-medium rounded-md text-white 
                 bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span>Saving...</span>
        ) : (
          <span>{initialData ? "Update" : "Add"} Transaction</span>
        )}
      </button>
    </form>
  );
}
