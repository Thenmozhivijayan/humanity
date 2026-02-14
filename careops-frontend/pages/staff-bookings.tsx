import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

type Booking = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  contact: { name?: string; email?: string; phone?: string };
  service: { name: string; duration: number };
};

export default function StaffBookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadBookings();
    }
  }, [user, authLoading, router, date]);

  const loadBookings = async () => {
    try {
      const res = await api.get(`/staff/bookings?workspaceId=${user?.workspaceId}&date=${date}`);
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to load bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/staff/booking/${id}`, { status });
      loadBookings();
    } catch (error) {
      alert('Failed to update booking');
    }
  };

  if (authLoading || loading) {
    return <Layout><div style={{ padding: 40 }}>Loading...</div></Layout>;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div style={{ padding: 40 }}>
        <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>📅 Bookings</h1>
            <p style={{ color: "#666", margin: 0 }}>Manage today's appointments</p>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: 8,
              fontSize: 16,
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        {bookings.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e0e0e0'
          }}>
            <p style={{ fontSize: 18, color: '#666' }}>No bookings for this date.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 15 }}>
          {bookings.map((booking) => {
            const statusColors = {
              CONFIRMED: { bg: '#fef3c7', color: '#92400e', border: '#fbbf24' },
              COMPLETED: { bg: '#d1fae5', color: '#065f46', border: '#34d399' },
              NO_SHOW: { bg: '#fee2e2', color: '#991b1b', border: '#f87171' },
              CANCELLED: { bg: '#f3f4f6', color: '#374151', border: '#9ca3af' }
            };
            const colors = statusColors[booking.status as keyof typeof statusColors] || statusColors.CONFIRMED;

            return (
              <div
                key={booking.id}
                style={{
                  padding: 25,
                  border: `2px solid ${colors.border}`,
                  borderRadius: 12,
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'start', marginBottom: 15 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 20 }}>{booking.service.name}</h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        background: colors.bg,
                        color: colors.color,
                        fontSize: 12,
                        fontWeight: '600'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                    <p style={{ margin: '8px 0', color: "#667eea", fontWeight: '600', fontSize: 16 }}>
                      ⏰ {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div style={{ marginTop: 10 }}>
                      <p style={{ margin: '5px 0', color: '#333' }}>
                        👤 {booking.contact.name || booking.contact.email}
                      </p>
                      {booking.contact.phone && (
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          📱 {booking.contact.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {booking.status === "CONFIRMED" && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 15, paddingTop: 15, borderTop: '1px solid #e0e0e0' }}>
                    <button
                      onClick={() => updateStatus(booking.id, "COMPLETED")}
                      style={{
                        flex: 1,
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: 14
                      }}
                    >
                      ✓ Mark Completed
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, "NO_SHOW")}
                      style={{
                        flex: 1,
                        padding: '10px 20px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: 14
                      }}
                    >
                      ✗ No Show
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
