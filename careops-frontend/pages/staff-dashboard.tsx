import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

export default function StaffDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Layout><div style={{ padding: 40 }}>Loading...</div></Layout>;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div style={{ padding: 40 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>Staff Dashboard</h1>
          <p style={{ color: "#666", margin: 0 }}>Manage daily operations</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <div
            onClick={() => router.push("/inbox")}
            style={{
              padding: 40,
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              cursor: "pointer",
              textAlign: "center",
              background: "white",
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 20 }}>💬</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: 20 }}>Inbox</h3>
            <p style={{ color: "#666", margin: 0 }}>Reply to customers</p>
          </div>

          <div
            onClick={() => router.push("/staff-bookings")}
            style={{
              padding: 40,
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              cursor: "pointer",
              textAlign: "center",
              background: "white",
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 20 }}>📅</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: 20 }}>Bookings</h3>
            <p style={{ color: "#666", margin: 0 }}>Manage appointments</p>
          </div>

          <div
            onClick={() => router.push("/staff-forms")}
            style={{
              padding: 40,
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              cursor: "pointer",
              textAlign: "center",
              background: "white",
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 20 }}>📝</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: 20 }}>Forms</h3>
            <p style={{ color: "#666", margin: 0 }}>Review submissions</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
