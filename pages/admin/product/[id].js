import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

export default function AdminProductEdit() {
  const { query } = useRouter();
  const productId = query.id;
  const isNewProduct = productId === "new";
  const router = useRouter();

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: !isNewProduct,
      error: "",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("image", data.image);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("countInStock", data.countInStock);
        setValue("description", data.description);
        setValue("isFeatured", data.isFeatured);
        setValue("banner", data.banner);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!isNewProduct) {
      fetchData();
    }
  }, [productId, setValue, isNewProduct]);

  const uploadHandler = async (e, imageField = "image") => {
    // Check if Cloudinary is configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      toast.error("Cloudinary is not configured. Please enter image URL directly in the text field above.");
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      
      console.log('=== UPLOAD HANDLER ===');
      console.log('Requesting signature from /api/admin/cloudinary-sign');
      
      const {
        data: { signature, timestamp },
      } = await axios.get("/api/admin/cloudinary-sign");
      
      console.log('✓ Signature received');

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      
      console.log('Uploading to Cloudinary...');
      const { data } = await axios.post(url, formData);
      
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      toast.success("File uploaded successfully");
      console.log('✓ Upload complete:', data.secure_url);
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      console.error('=== UPLOAD ERROR ===');
      console.error('Error:', err);
      console.error('Error response:', err.response?.data);
      toast.error(getError(err));
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
    isFeatured,
    banner,
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      
      if (isNewProduct) {
        // Create new product
        await axios.post(`/api/admin/products`, {
          name,
          slug,
          price,
          category,
          image,
          brand,
          countInStock,
          description,
          isFeatured,
          banner,
        });
        toast.success("Product created successfully");
      } else {
        // Update existing product
        const { data } = await axios.put(`/api/admin/products/${productId}`, {
          name,
          slug,
          price,
          category,
          image,
          brand,
          countInStock,
          description,
          isFeatured,
          banner,
        });
        
        // Show special message if product was restocked
        if (data.restocked) {
          toast.success("Product updated and restock notifications sent!", {
            autoClose: 5000,
          });
        } else {
          toast.success("Product updated successfully");
        }
      }
      
      dispatch({ type: "UPDATE_SUCCESS" });
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={isNewProduct ? "Create Product" : `Edit Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li className="flex items-center font-bold text-blue-700">
              <Link href="/admin/products">Products</Link>
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
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-3xl font-bold">
                {isNewProduct ? "Create Product" : `Edit Product ${productId}`}
              </h1>
              
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register("name", {
                    required: "Please enter name",
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register("slug", {
                    required: "Please enter slug",
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full"
                  id="price"
                  {...register("price", {
                    required: "Please enter price",
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  className="w-full"
                  id="image"
                  placeholder="Enter image URL (e.g., https://images.unsplash.com/...)"
                  {...register("image", {
                    required: "Please enter image URL",
                  })}
                />
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  You can use image URLs from Unsplash, Imgur, or any other image hosting service
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="imageFile">Upload Image (Cloudinary)</label>
                <input
                  type="file"
                  className="w-full"
                  id="imageFile"
                  onChange={uploadHandler}
                />
                {loadingUpload && <div>Uploading...</div>}
                {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Cloudinary not configured. Please enter image URL directly above.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  className="w-full"
                  id="category"
                  {...register("category", {
                    required: "Please enter category",
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register("brand", {
                    required: "Please enter brand",
                  })}
                />
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="countInStock">Count In Stock</label>
                <input
                  type="number"
                  className="w-full"
                  id="countInStock"
                  {...register("countInStock", {
                    required: "Please enter count in stock",
                  })}
                />
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <textarea
                  className="w-full"
                  id="description"
                  rows="4"
                  {...register("description", {
                    required: "Please enter description",
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="isFeatured" className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    id="isFeatured"
                    {...register("isFeatured")}
                  />
                  Is Featured
                </label>
              </div>

              <div className="mb-4">
                <label htmlFor="banner">Banner Image URL (for featured products)</label>
                <input
                  type="text"
                  className="w-full"
                  id="banner"
                  placeholder="Enter banner image URL (optional)"
                  {...register("banner")}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bannerFile">Upload Banner (Cloudinary)</label>
                <input
                  type="file"
                  className="w-full"
                  id="bannerFile"
                  onChange={(e) => uploadHandler(e, "banner")}
                />
                {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Cloudinary not configured. Please enter banner URL directly above.
                  </p>
                )}
              </div>

              <div className="mb-4 flex justify-between">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? "Loading..." : isNewProduct ? "Create" : "Update"}
                </button>
                <Link href="/admin/products">
                  <button type="button" className="default-button">
                    Back
                  </button>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEdit.auth = { adminOnly: true };
