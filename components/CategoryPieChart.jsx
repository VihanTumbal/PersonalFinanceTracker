import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9A8194",
  "#392F5A",
  "#FF8C42",
  "#6C5B7B",
];

export default function CategoryPieChart({ transactions }) {
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Math.abs(transaction.amount);
    return acc;
  }, {});

  const data = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
    icon:
      TRANSACTION_CATEGORIES.find((cat) => cat.label === name)?.icon || "📌",
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, icon }) => `${icon} ${name}`}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
