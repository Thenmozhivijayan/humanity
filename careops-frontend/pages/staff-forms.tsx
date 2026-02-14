import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

type FormSubmission = {
  id: string;
  status: string;
  createdAt: string;
  data: string;
  form: { name: string };
  booking?: { contact: { name?: string; email?: string } };
};

export default function StaffFormsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormSubmission | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadForms();
    }
  }, [user, authLoading, router]);

  const loadForms = async () => {
    try {
      const res = await api.get(`/staff/forms?workspaceId=${user?.workspaceId}`);
      setSubmissions(res.data);
    } catch (error) {
      console.error('Failed to load forms', error);
    } finally {
      setLoading(false);
    }
  };

  const markReviewed = async (id: string) => {
    try {
      await api.patch(`/staff/form/${id}`);
      setSelectedForm(null);
      loadForms();
    } catch (error) {
      alert('Failed to mark as reviewed');
    }
  };

  const getDaysOld = (date: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
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
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>📝 Pending Forms</h1>
          <p style={{ color: "#666", margin: 0 }}>Review customer form submissions</p>
        </div>

        {submissions.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <p style={{ fontSize: 18, color: '#666' }}>No pending forms!</p>
            <p style={{ color: '#999' }}>All submissions have been reviewed</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 15 }}>
          {submissions.map((sub) => {
            const daysOld = getDaysOld(sub.createdAt);
            const isOverdue = daysOld > 3;

            return (
              <div
                key={sub.id}
                style={{
                  padding: 25,
                  border: `2px solid ${isOverdue ? '#fca5a5' : '#e0e0e0'}`,
                  borderRadius: 12,
                  background: isOverdue ? '#fef2f2' : 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 20 }}>{sub.form.name}</h3>
                      {isOverdue && (
                        <span style={{
                          padding: '4px 12px',
                          background: '#dc2626',
                          color: 'white',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: '600'
                        }}>
                          ⚠️ OVERDUE
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '8px 0', color: '#333' }}>
                      👤 {sub.booking?.contact.name || sub.booking?.contact.email || "Unknown"}
                    </p>
                    <p style={{ margin: 0, fontSize: 14, color: isOverdue ? '#dc2626' : '#666' }}>
                      📅 {daysOld === 0 ? "Submitted today" : `Submitted ${daysOld} day${daysOld > 1 ? 's' : ''} ago`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => setSelectedForm(sub)}
                      style={{
                        padding: '10px 20px',
                        background: 'white',
                        color: '#667eea',
                        border: '2px solid #667eea',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: 14
                      }}
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => markReviewed(sub.id)}
                      style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: 14
                      }}
                    >
                      ✓ Mark Reviewed
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setSelectedForm(null)}>
            <div style={{
              background: 'white',
              padding: 30,
              borderRadius: 12,
              maxWidth: 600,
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ margin: '0 0 20px 0' }}>{selectedForm.form.name}</h2>
              <div style={{
                padding: 20,
                background: '#f9fafb',
                borderRadius: 8,
                marginBottom: 20
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(JSON.parse(selectedForm.data || '{}'), null, 2)}
                </pre>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setSelectedForm(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => markReviewed(selectedForm.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  ✓ Mark Reviewed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
