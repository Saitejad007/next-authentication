import React from "react";
import { useSession, getSession } from "next-auth/react";

const Protected = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return <div>This is Protected page 1</div>;
};

export default Protected;
