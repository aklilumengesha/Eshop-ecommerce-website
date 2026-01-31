import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>eShop - Modern E-commerce Platform</title>
        <meta name="description" content="eShop - Your one-stop online shopping destination" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <main className="flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">
            Welcome to eShop
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your modern e-commerce platform is being built...
          </p>
          <div className="flex gap-4">
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-2">🛍️ Shop</h2>
              <p className="text-gray-600">Browse our products</p>
            </div>
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-2">🛒 Cart</h2>
              <p className="text-gray-600">Manage your items</p>
            </div>
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-2">💳 Checkout</h2>
              <p className="text-gray-600">Secure payments</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
