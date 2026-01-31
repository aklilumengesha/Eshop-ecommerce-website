import Layout from "@/components/Layout";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Store } from "@/utils/Store";
import Link from "next/link";
import React, { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";
import { formatPrice } from "@/utils/currency";

function Cart() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    cart: { cartItems },
    currency,
  } = state;

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
    toast.success("Product removed from cart");
  };

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity: quantity },
    });

    toast.success("Cart updated");
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-3xl font-bold">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link href="/">
            <button className="primary-button">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="px-5 text-right">Quantity</th>
                  <th className="px-5 text-right">Price</th>
                  <th className="px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <span className="flex items-center">
                          <Image
                            className="rounded-sm"
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="ml-3">{item.name}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                        className="rounded border p-2"
                      >
                        {[...Array(item.countInStock).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right font-semibold">{formatPrice(item.price, currency)}</td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => removeItemHandler(item)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <ul className="space-y-3">
              <li>
                <div className="flex justify-between text-lg">
                  <div>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</div>
                </div>
              </li>
              <li className="border-t pt-3">
                <div className="flex justify-between text-2xl font-bold">
                  <div>Total</div>
                  <div className="text-blue-600">
                    {formatPrice(
                      cartItems.reduce(
                        (total, item) => total + item.quantity * item.price,
                        0
                      ),
                      currency
                    )}
                  </div>
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Proceed to Checkout
                </button>
              </li>
              <li>
                <Link href="/">
                  <button className="default-button w-full">
                    Continue Shopping
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
