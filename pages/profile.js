import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "@/utils/error";
import axios from "axios";
import Head from "next/head";

export default function Profile() {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name);
      setValue("email", session.user.email);
    }
  }, [session, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      toast.success("Profile updated successfully");

      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Head>
        <title>Profile - eShop</title>
        <meta name="description" content="Update your profile information" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Update Profile
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Manage your account information
            </p>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="mt-8 space-y-6 card p-8"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Please enter name",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full mt-1"
                  id="name"
                  autoFocus
                />
                {errors.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name.message}</div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Please enter email",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                      message: "Please enter valid email",
                    },
                  })}
                  className="w-full mt-1"
                  id="email"
                />
                {errors.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full mt-1"
                  id="password"
                  placeholder="Leave blank to keep current password"
                />
                {errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    validate: (value) => {
                      const password = getValues("password");
                      if (password && value !== password) {
                        return "Passwords do not match";
                      }
                      return true;
                    },
                    minLength: {
                      value: 6,
                      message: "Confirm password must be at least 6 characters",
                    },
                  })}
                  className="w-full mt-1"
                  id="confirmPassword"
                  placeholder="Leave blank to keep current password"
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button className="primary-button w-full" type="submit">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

Profile.auth = true;
