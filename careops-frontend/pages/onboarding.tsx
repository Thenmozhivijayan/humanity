import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../src/context/AuthContext";
import api from "../src/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/register');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  const submit = async () => {
    try {
      router.push("/integrations");
    } catch (error) {
      alert("Failed to proceed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome to CareOps Setup</h2>
      <p>Your workspace has been created. Let's set up integrations.</p>
      <button onClick={submit} style={{ padding: "10px 20px" }}>Continue to Integrations →</button>
    </div>
  );
}
