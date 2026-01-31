import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

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
        <title>Register - eShop</title>
        <meta name="description" content="Create your eShop account" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join eShop today
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
                  placeholder="John Doe"
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
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Please enter password",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full mt-1"
                  id="password"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (value) => value === getValues("password"),
                    minLength: {
                      value: 6,
                      message: "Confirm password must be at least 6 characters",
                    },
                  })}
                  className="w-full mt-1"
                  id="confirmPassword"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </div>
                )}
                {errors.confirmPassword &&
                  errors.confirmPassword.type === "validate" && (
                    <div className="text-red-500 text-sm mt-1">Passwords do not match</div>
                  )}
              </div>
            </div>

            <div>
              <button className="primary-button w-full" type="submit">
                Create Account
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <Link href={`/login?redirect=${redirect || "/"}`} className="font-medium">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
