import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

type Staff = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function StaffManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'OWNER') {
      router.push('/staff-dashboard');
      return;
    }
    if (user) {
      loadStaff();
    }
  }, [user, authLoading, router]);

  const loadStaff = async () => {
    try {
      const res = await api.get(`/workspace/${user?.workspaceId}/staff`);
      setStaff(res.data || []);
    } catch (error) {
      console.error('Failed to load staff', error);
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    setAdding(true);
    try {
      await api.post(`/workspace/${user?.workspaceId}/staff`, {
        email,
        password,
      });
      
      alert(`Staff added successfully!\n\nCredentials:\nEmail: ${email}\nPassword: ${password}\n\nShare these with the staff member.`);
      
      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      loadStaff();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add staff');
    } finally {
      setAdding(false);
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
            <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>👥 Staff Management</h1>
            <p style={{ color: "#666", margin: 0 }}>Manage your team members</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: 16
            }}
          >
            {showForm ? '✕ Cancel' : '➕ Add Staff'}
          </button>
        </div>

        {showForm && (
          <div style={{
            marginBottom: 30,
            padding: 30,
            background: 'white',
            borderRadius: 12,
            border: '2px solid #667eea',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Add New Staff Member</h3>
            
            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Staff Name</label>
                <input
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Email</label>
                <input
                  type="email"
                  placeholder="jane@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Password</label>
                <input
                  type="text"
                  placeholder="staff123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
                <p style={{ margin: '5px 0 0 0', fontSize: 12, color: '#666' }}>
                  💡 This password will be shown once. Make sure to share it with the staff member.
                </p>
              </div>

              <button
                onClick={addStaff}
                disabled={adding}
                style={{
                  padding: '14px',
                  background: adding ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: adding ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: 16
                }}
              >
                {adding ? '⏳ Adding...' : '✅ Add Staff Member'}
              </button>
            </div>
          </div>
        )}

        <h3 style={{ marginBottom: 20, fontSize: '24px' }}>Team Members</h3>

        {staff.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e0e0e0'
          }}>
            <p style={{ fontSize: 18, color: '#666' }}>No staff members yet.</p>
            <p style={{ color: '#999' }}>Click "Add Staff" to invite your first team member</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 15 }}>
          {staff.map((member) => (
            <div
              key={member.id}
              style={{
                padding: 25,
                background: 'white',
                borderRadius: 12,
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 18 }}>{member.email}</h4>
                  <span style={{
                    padding: '4px 12px',
                    background: member.role === 'OWNER' ? '#dbeafe' : '#f3e8ff',
                    color: member.role === 'OWNER' ? '#1e40af' : '#6b21a8',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: '600'
                  }}>
                    {member.role === 'OWNER' ? '👑 Owner' : '👤 Staff'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                  Added on {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
