import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "@/utils/error";
import ReactStars from "react-rating-stars-component";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, reviews: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

export default function AdminReviewsScreen() {
  const [{ loading, error, reviews, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      reviews: [],
      error: "",
    }
  );

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/reviews`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/reviews/${reviewId}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Review deleted successfully");
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(err));
    }
  };

  const updateStatusHandler = async (reviewId, newStatus) => {
    try {
      await axios.put(`/api/admin/reviews/${reviewId}/status`, {
        status: newStatus,
      });
      toast.success(`Review ${newStatus}`);
      dispatch({ type: "DELETE_RESET" }); // Trigger refresh
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const submitResponseHandler = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setSubmittingResponse(true);
    try {
      await axios.post(`/api/admin/reviews/${selectedReview._id}/response`, {
        response: responseText.trim(),
      });
      toast.success("Response added successfully");
      setSelectedReview(null);
      setResponseText("");
      dispatch({ type: "DELETE_RESET" }); // Trigger refresh
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setSubmittingResponse(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterStatus !== "all" && review.status !== filterStatus) return false;
    if (filterRating !== "all" && review.rating !== parseInt(filterRating))
      return false;
    return true;
  });

  return (
    <Layout title="Admin Reviews">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
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
              <Link href="/admin/reviews" className="font-bold">
                Reviews
              </Link>
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
          <h1 className="mb-4 text-xl font-bold">Review Management</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="text-sm font-semibold mr-2">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mr-2">Rating:</label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="ml-auto text-sm text-gray-600 self-center">
                  {filteredReviews.length} reviews
                </div>
              </div>

              {/* Reviews Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Product</th>
                      <th className="p-5 text-left">User</th>
                      <th className="p-5 text-left">Rating</th>
                      <th className="p-5 text-left">Review</th>
                      <th className="p-5 text-left">Status</th>
                      <th className="p-5 text-left">Date</th>
                      <th className="p-5 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.map((review) => (
                      <tr key={review._id} className="border-b">
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            {review.product?.image && (
                              <div className="relative w-12 h-12">
                                <Image
                                  src={review.product.image}
                                  alt={review.product.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            )}
                            <div className="max-w-xs">
                              <p className="font-semibold text-sm truncate">
                                {review.product?.name || "Deleted Product"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div>
                            <p className="font-semibold">{review.userName}</p>
                            {review.verifiedPurchase && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-5">
                          <ReactStars
                            count={5}
                            value={review.rating}
                            size={20}
                            activeColor="#ffd700"
                            edit={false}
                          />
                        </td>
                        <td className="p-5">
                          <div className="max-w-xs">
                            <p className="font-semibold text-sm">
                              {review.title}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {review.comment}
                            </p>
                            {review.images?.length > 0 && (
                              <p className="text-xs text-blue-600 mt-1">
                                {review.images.length} image(s)
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-5">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              review.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : review.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {review.status}
                          </span>
                        </td>
                        <td className="p-5 text-sm">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col gap-2">
                            {review.status !== "approved" && (
                              <button
                                onClick={() =>
                                  updateStatusHandler(review._id, "approved")
                                }
                                className="text-green-600 hover:text-green-700 text-sm"
                              >
                                Approve
                              </button>
                            )}
                            {review.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  updateStatusHandler(review._id, "rejected")
                                }
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedReview(review)}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Respond
                            </button>
                            <button
                              onClick={() => deleteHandler(review._id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Respond to Review</h2>

            {/* Review Details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ReactStars
                  count={5}
                  value={selectedReview.rating}
                  size={20}
                  activeColor="#ffd700"
                  edit={false}
                />
                <span className="font-semibold">{selectedReview.userName}</span>
              </div>
              <h3 className="font-bold mb-2">{selectedReview.title}</h3>
              <p className="text-gray-700">{selectedReview.comment}</p>
            </div>

            {/* Response Form */}
            <form onSubmit={submitResponseHandler}>
              <label className="block text-sm font-semibold mb-2">
                Your Response
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response to this review..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingResponse}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {submittingResponse ? "Submitting..." : "Submit Response"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReview(null);
                    setResponseText("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

AdminReviewsScreen.auth = { adminOnly: true };
