import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/lib/api';

export default function CustomerDashboard() {
  const router = useRouter();
  const { customer, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) {
      router.push('/customer/login');
      return;
    }
    loadBookings();
  }, [customer]);

  const loadBookings = async () => {
    try {
      const res = await api.get(`/customer/${customer?.id}/bookings`);
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/customer/login');
  };

  if (!customer) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>👤 Customer Portal</h1>
          <a
            href="/public-pages/contact?workspaceId=1906903d-22da-4925-9884-cd759a17c96f"
            style={{
              color: '#6366f1',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '15px'
            }}
          >
            📧 Contact Us
          </a>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#333' }}>Welcome, {customer.name}!</h2>
          <div style={{ color: '#666' }}>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> {customer.email}</p>
            {customer.phone && <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {customer.phone}</p>}
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#333' }}>📅 My Bookings</h2>
          
          {loading ? (
            <p style={{ color: '#666' }}>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p style={{ fontSize: '18px', margin: '0 0 20px 0' }}>No bookings yet</p>
              <button
                onClick={() => router.push('/public-pages/book?workspaceId=1906903d-22da-4925-9884-cd759a17c96f')}
                style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {bookings.map((booking: any) => (
                <div
                  key={booking.id}
                  style={{
                    padding: '20px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{booking.service?.name}</h3>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      📅 {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString()}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      Status: <span style={{
                        padding: '4px 12px',
                        background: booking.status === 'CONFIRMED' ? '#e8f5e9' : '#fff3e0',
                        color: booking.status === 'CONFIRMED' ? '#2e7d32' : '#f57c00',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {booking.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
