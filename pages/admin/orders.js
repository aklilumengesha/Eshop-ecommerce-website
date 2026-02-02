import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { SkeletonTable } from "@/components/skeletons";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminOrders() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Orders">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="flex items-center font-bold text-blue-700">
              <Link href="/admin/orders">Orders</Link>
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
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-3xl font-bold">Orders Management</h1>
          {loading ? (
            <SkeletonTable rows={10} columns={7} />
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="px-5 text-left">USER</th>
                    <th className="px-5 text-left">DATE</th>
                    <th className="px-5 text-left">TOTAL</th>
                    <th className="px-5 text-left">PAID</th>
                    <th className="px-5 text-left">DELIVERED</th>
                    <th className="px-5 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {order.user ? order.user.name : "DELETED USER"}
                      </td>
                      <td className="p-5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5">${order.totalPrice}</td>
                      <td className="p-5">
                        {order.isPaid ? (
                          <span className="text-green-600">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-red-600">Not paid</span>
                        )}
                      </td>
                      <td className="p-5">
                        {order.isDelivered ? (
                          <span className="text-green-600">
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-red-600">Not delivered</span>
                        )}
                      </td>
                      <td className="p-5">
                        <Link href={`/order/${order._id}`} passHref>
                          <button className="primary-button">Details</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrders.auth = { adminOnly: true };
