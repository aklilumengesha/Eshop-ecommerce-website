import Layout from "@/components/Layout";
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
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul className="space-y-2">
            <li className="flex items-center font-bold text-blue-700">
              <Link href="/admin/dashboard">Dashboard</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
            <li>
              <Link href="/admin/reviews">Reviews</Link>
            </li>
            <li>
              <Link href="/admin/coupons">Coupons</Link>
            </li>
            <li>
              <Link href="/admin/stock-notifications">Stock Notifications</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h1 className="mb-4 text-3xl font-bold">Admin Dashboard</h1>
          {loading ? (
            <SkeletonStats count={4} />
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="card p-5">
                  <p className="text-3xl font-bold text-blue-600">
                    ${summary.ordersPrice}
                  </p>
                  <p className="text-gray-600">Sales</p>
                  <Link href="/admin/orders" className="text-blue-600">
                    View sales
                  </Link>
                </div>

                <div className="card p-5">
                  <p className="text-3xl font-bold text-blue-600">
                    {summary.ordersCount}
                  </p>
                  <p className="text-gray-600">Orders</p>
                  <Link href="/admin/orders" className="text-blue-600">
                    View orders
                  </Link>
                </div>

                <div className="card p-5">
                  <p className="text-3xl font-bold text-blue-600">
                    {summary.productsCount}
                  </p>
                  <p className="text-gray-600">Products</p>
                  <Link href="/admin/products" className="text-blue-600">
                    View products
                  </Link>
                </div>

                <div className="card p-5">
                  <p className="text-3xl font-bold text-blue-600">
                    {summary.usersCount}
                  </p>
                  <p className="text-gray-600">Users</p>
                  <Link href="/admin/users" className="text-blue-600">
                    View users
                  </Link>
                </div>
              </div>

              {/* Stock Notifications Card */}
              {notificationStats && (
                <div className="mt-5">
                  <div className="card p-5 bg-gradient-to-br from-purple-50 to-blue-50">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Stock Notifications</h2>
                      <Link href="/admin/stock-notifications">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                          View Details
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-600">
                              {notificationStats.pending}
                            </p>
                            <p className="text-sm text-gray-600">Pending</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">
                              {notificationStats.sent}
                            </p>
                            <p className="text-sm text-gray-600">Sent</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600">
                              {notificationStats.total}
                            </p>
                            <p className="text-sm text-gray-600">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {notificationStats.pending > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>{notificationStats.pending}</strong> customers waiting for products to restock.
                          Update product inventory to automatically notify them!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold mt-8 mb-4">Sales Report</h2>
              <Bar options={options} data={data} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

Dashboard.auth = { adminOnly: true };
