import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

type Alert = {
  id: string;
  type: string;
  message: string;
  link?: string;
};

type DashboardData = {
  workspace: any;
  alerts: Alert[];
  bookingsToday: number;
  pendingForms: number;
  unansweredMessages: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'OWNER') {
      router.push('/staff-dashboard');
      return;
    }

    async function loadDashboard() {
      try {
        const res = await api.get(`/dashboard?workspaceId=${user?.workspaceId}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <p style={{ padding: 40 }}>Loading dashboard...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div style={{ padding: 40 }}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>Owner Dashboard</h1>
          <p style={{ color: "#666", margin: 0 }}>Real-time business overview</p>
        </div>

        <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <div style={{
            padding: 30,
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            background: "white",
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: 0, color: "#667eea", fontSize: '14px', fontWeight: '600' }}>TODAY'S BOOKINGS</h4>
            <p style={{ fontSize: 48, margin: "15px 0 0 0", fontWeight: "bold", color: '#333' }}>{data?.bookingsToday || 0}</p>
          </div>
          <div style={{
            padding: 30,
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            background: "white",
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: 0, color: "#f59e0b", fontSize: '14px', fontWeight: '600' }}>PENDING FORMS</h4>
            <p style={{ fontSize: 48, margin: "15px 0 0 0", fontWeight: "bold", color: '#333' }}>{data?.pendingForms || 0}</p>
          </div>
          <div style={{
            padding: 30,
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            background: "white",
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: 0, color: "#ef4444", fontSize: '14px', fontWeight: '600' }}>UNANSWERED MESSAGES</h4>
            <p style={{ fontSize: 48, margin: "15px 0 0 0", fontWeight: "bold", color: '#333' }}>{data?.unansweredMessages || 0}</p>
          </div>
        </div>

        <h2 style={{ marginTop: 50, marginBottom: 20, fontSize: '24px' }}>🔔 Alerts</h2>

        {data?.alerts.length === 0 && (
          <div style={{
            padding: 20,
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 12,
            color: '#166534'
          }}>
            <p style={{ margin: 0, fontSize: 16 }}>✓ No alerts - everything is running smoothly!</p>
          </div>
        )}

        {data?.alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              marginTop: 10,
              padding: 20,
              border: "2px solid #fca5a5",
              borderRadius: 12,
              background: "#fef2f2",
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <strong style={{ color: "#dc2626", fontSize: '14px' }}>{alert.type}</strong>
              <p style={{ margin: "8px 0 0 0", color: '#333' }}>{alert.message}</p>
            </div>
            {alert.link && (
              <a
                href={alert.link}
                style={{
                  padding: "10px 20px",
                  background: "#dc2626",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 8,
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
              >
                View →
              </a>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
