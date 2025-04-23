import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to ZestLeads!</h1>
      {session?.user ? (
        <div className="mt-4">
          <p>Logged in as: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
        </div>
      ) : (
        <p className="mt-4">You are not logged in.</p>
      )}
    </div>
  );
}
