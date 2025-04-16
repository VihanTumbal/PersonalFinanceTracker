# Personal Finance Visualizer

A modern web application for tracking and visualizing personal financial transactions built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 📊 Interactive dashboard with expense visualization
- 💰 Track income and expenses
- 📈 Monthly expense trends
- 🔄 Real-time category breakdown
- 📱 Responsive design for all devices
- 🎨 Dark/Light mode support
- ⚡ Real-time updates

## Tech Stack

- **Frontend**: Next.js 15.3.0, React 19.0.0
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Heroicons
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- npm or yarn package manager

## Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory with:

```env
MONGODB_URI="your_mongodb_connection_string"
```

## Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
PersonalFinanceTracker/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── layout.js        # Root layout
│   └── page.js          # Main page component
├── components/          # React components
├── lib/                 # Utility functions
├── models/             # MongoDB models
└── public/             # Static assets
```

## Key Components

- **TransactionForm**: Handles adding/editing transactions
- **TransactionList**: Displays all transactions
- **ExpenseChart**: Shows monthly expense trends
- **CategoryPieChart**: Visualizes spending by category
- **DashboardSummary**: Displays financial overview

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
