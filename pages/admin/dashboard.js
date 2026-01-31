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
    default:
      return state;
  }
}

export default function Dashboard() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesDate: [] },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/summary");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
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
          </ul>
        </div>
        <div className="md:col-span-3">
          <h1 className="mb-4 text-3xl font-bold">Admin Dashboard</h1>
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="spinner"></div>
            </div>
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
