import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Login() {
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
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <>
      <Head>
        <title>Login - eShop</title>
        <meta name="description" content="Login to your eShop account" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back to eShop
            </p>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="mt-8 space-y-6 card p-8"
          >
            <div className="space-y-4">
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
                  autoFocus
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
                  <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>
                )}
              </div>
            </div>

            <div>
              <button className="primary-button w-full" type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don&apos;t have an account?</span>{" "}
              <Link href={`/register?redirect=${redirect || "/"}`} className="font-medium">
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
