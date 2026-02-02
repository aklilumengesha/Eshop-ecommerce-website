import AdminLayout from "@/components/AdminLayout";
import { getError } from "@/utils/error";
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { Bar } from "react-chartjs-2";
import { SkeletonStats } from "@/components/skeletons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "FETCH_NOTIFICATIONS_SUCCESS":
      return { ...state, notificationStats: action.payload };
    default:
      return state;
  }
}

export default function Dashboard() {
  const [{ loading, error, summary, notificationStats }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesDate: [] },
    notificationStats: null,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/summary");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        
        // Fetch notification stats
        try {
          const { data: notifData } = await axios.get("/api/stock-notifications/stats");
          dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", payload: notifData });
        } catch (notifError) {
          console.error("Failed to fetch notification stats:", notifError);
        }
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: summary.salesDate.map((x) => x._id),
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        data: summary.salesDate.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <AdminLayout title="Dashboard">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      {loading ? (
        <SkeletonStats count={4} />
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${summary.ordersPrice}
              </p>
              <Link href="/admin/orders" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                View sales →
              </Link>
            </div>

            <div className="card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary.ordersCount}
              </p>
              <Link href="/admin/orders" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                View orders →
              </Link>
            </div>

            <div className="card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary.productsCount}
              </p>
              <Link href="/admin/products" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                View products →
              </Link>
            </div>

            <div className="card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary.usersCount}
              </p>
              <Link href="/admin/users" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                View users →
              </Link>
            </div>
          </div>

          {/* Stock Notifications Card */}
          {notificationStats && (
            <div className="card p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Stock Notifications</h2>
                <Link href="/admin/stock-notifications">
                  <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1 cursor-pointer">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {notificationStats.pending}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {notificationStats.sent}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {notificationStats.total}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    </div>
                  </div>
                </div>
              </div>
              {notificationStats.pending > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>{notificationStats.pending}</strong> customers waiting for products to restock.
                    Update product inventory to automatically notify them!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="card p-5">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sales Report</h2>
            <Bar options={options} data={data} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

Dashboard.auth = { adminOnly: true };
