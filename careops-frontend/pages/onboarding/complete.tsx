import { useState } from "react";
import { useRouter } from "next/router";
import api from "../../src/lib/api";

export default function CompletePage() {
  const router = useRouter();
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");

  const activate = async () => {
    setActivating(true);
    setError("");

    try {
      const workspaceId = localStorage.getItem("workspaceId");
      await api.post(`/workspace/${workspaceId}/activate`);
      alert("🎉 Workspace activated! You're ready to go.");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Activation failed");
    } finally {
      setActivating(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <h2>🚀 Ready to Launch!</h2>
      <p>Your workspace is configured. Click below to activate.</p>

      <div style={{ marginTop: 30, padding: 20, background: "#f8f9fa", borderRadius: 8 }}>
        <h3>What happens next?</h3>
        <ul style={{ textAlign: "left", lineHeight: 2 }}>
          <li>✓ Your booking page goes live</li>
          <li>✓ Contact forms become active</li>
          <li>✓ Automation starts running</li>
          <li>✓ You can start accepting bookings</li>
        </ul>
      </div>

      {error && (
        <div style={{ marginTop: 20, padding: 15, background: "#f8d7da", borderRadius: 4, color: "#721c24" }}>
          {error}
        </div>
      )}

      <button
        onClick={activate}
        disabled={activating}
        style={{
          marginTop: 30,
          padding: "15px 40px",
          fontSize: 18,
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: activating ? "not-allowed" : "pointer",
        }}
      >
        {activating ? "Activating..." : "Activate Workspace"}
      </button>
    </div>
  );
}
