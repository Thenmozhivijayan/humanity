import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

type Service = {
  id: string;
  name: string;
  duration: number;
  location?: string;
  availability: any[];
};

export default function ServicesManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', duration: 60, location: '' });
  const [showAvailabilityForm, setShowAvailabilityForm] = useState<string | null>(null);
  const [newAvailability, setNewAvailability] = useState({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadServices();
    }
  }, [user, authLoading, router]);

  const loadServices = async () => {
    try {
      const res = await api.get(`/workspace/${user?.workspaceId}/services`);
      setServices(res.data);
    } catch (error) {
      console.error('Failed to load services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/workspace/${user?.workspaceId}/services`, newService);
      setNewService({ name: '', duration: 60, location: '' });
      setShowAddForm(false);
      loadServices();
    } catch (error) {
      alert('Failed to add service');
    }
  };

  const handleAddAvailability = async (e: React.FormEvent, serviceId: string) => {
    e.preventDefault();
    try {
      await api.post(`/services/${serviceId}/availability`, newAvailability);
      setNewAvailability({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
      setShowAvailabilityForm(null);
      loadServices();
    } catch (error) {
      alert('Failed to add availability');
    }
  };

  if (authLoading || loading) {
    return <Layout><div style={{ padding: 40 }}>Loading...</div></Layout>;
  }

  if (!user) {
    return null;
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Layout>
      <div style={{ padding: 40 }}>
        <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>🛠️ Services</h1>
            <p style={{ color: "#666", margin: 0 }}>Manage your service offerings</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '12px 24px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add Service'}
          </button>
        </div>

        {services.length > 0 && (
          <div style={{
            padding: 20,
            background: '#e0e7ff',
            border: '2px solid #6366f1',
            borderRadius: 12,
            marginBottom: 30
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#4338ca' }}>📋 Public Booking Link</h4>
            <p style={{ margin: '0 0 10px 0', color: '#4338ca', fontSize: '14px' }}>Share this link with customers to book appointments:</p>
            <div style={{
              padding: '12px',
              background: 'white',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              wordBreak: 'break-all'
            }}>
              http://localhost:3001/public-pages/book?workspaceId={user?.workspaceId}
            </div>
          </div>
        )}

        {showAddForm && (
          <div style={{
            padding: 30,
            background: 'white',
            borderRadius: 12,
            border: '2px solid #6366f1',
            marginBottom: 30
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Add New Service</h3>
            <form onSubmit={handleAddService}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Service Name *</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  required
                  placeholder="e.g., Consultation"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Duration (minutes) *</label>
                <input
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                  required
                  min="15"
                  step="15"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Location</label>
                <input
                  type="text"
                  value={newService.location}
                  onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                  placeholder="e.g., Office, Online"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add Service
              </button>
            </form>
          </div>
        )}

        {services.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e0e0e0'
          }}>
            <p style={{ fontSize: 18, color: '#666' }}>No services configured yet.</p>
            <p style={{ color: '#999' }}>Add services during onboarding or via API</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 20 }}>
          {services.map((service) => (
            <div
              key={service.id}
              style={{
                padding: 30,
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                background: "white",
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: '24px', color: '#333' }}>{service.name}</h3>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '6px 12px',
                      background: '#ede9fe',
                      color: '#6b21a8',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: '500'
                    }}>
                      ⏱️ {service.duration} minutes
                    </span>
                    {service.location && (
                      <span style={{
                        padding: '6px 12px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: '500'
                      }}>
                        📍 {service.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>AVAILABILITY</h4>
                  <button
                    onClick={() => setShowAvailabilityForm(showAvailabilityForm === service.id ? null : service.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {showAvailabilityForm === service.id ? 'Cancel' : '+ Add Time Slot'}
                  </button>
                </div>

                {showAvailabilityForm === service.id && (
                  <div style={{
                    padding: 20,
                    background: '#f9fafb',
                    borderRadius: 8,
                    marginBottom: 15,
                    border: '2px solid #6366f1'
                  }}>
                    <form onSubmit={(e) => handleAddAvailability(e, service.id)}>
                      <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', fontSize: '14px' }}>Day of Week</label>
                        <select
                          value={newAvailability.dayOfWeek}
                          onChange={(e) => setNewAvailability({ ...newAvailability, dayOfWeek: parseInt(e.target.value) })}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value={0}>Sunday</option>
                          <option value={1}>Monday</option>
                          <option value={2}>Tuesday</option>
                          <option value={3}>Wednesday</option>
                          <option value={4}>Thursday</option>
                          <option value={5}>Friday</option>
                          <option value={6}>Saturday</option>
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', fontSize: '14px' }}>Start Time</label>
                          <input
                            type="time"
                            value={newAvailability.startTime}
                            onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', fontSize: '14px' }}>End Time</label>
                          <input
                            type="time"
                            value={newAvailability.endTime}
                            onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        style={{
                          padding: '10px 20px',
                          background: '#6366f1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Add Time Slot
                      </button>
                    </form>
                  </div>
                )}

                {service.availability.length === 0 ? (
                  <p style={{ color: "#999", margin: 0 }}>No availability set</p>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {service.availability.map((slot, i) => (
                      <div key={i} style={{
                        padding: '12px 16px',
                        background: '#f9fafb',
                        borderRadius: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: '600', color: '#333' }}>
                          {dayNames[slot.dayOfWeek]}
                        </span>
                        <span style={{ color: '#667eea', fontWeight: '500' }}>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
