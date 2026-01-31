import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";

export default function TestSession() {
  const { data: session, status } = useSession();

  return (
    <Layout title="Test Session">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Session Test Page</h1>
        
        <div className="bg-gray-100 p-6 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-2">Status:</h2>
          <p className="text-lg">{status}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Session Data:</h2>
          <pre className="bg-white p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {session?.user && (
          <div className="mt-4 bg-blue-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">User Info:</h2>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Name:</strong> {session.user.name}</p>
            <p><strong>ID:</strong> {session.user._id}</p>
            <p><strong>Is Admin:</strong> {session.user.isAdmin ? "✓ YES" : "✗ NO"}</p>
            <p><strong>Is Admin Type:</strong> {typeof session.user.isAdmin}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
