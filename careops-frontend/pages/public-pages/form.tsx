import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../../src/lib/api";

type Form = {
  id: string;
  name: string;
  fields: string;
};

export default function PublicFormPage() {
  const router = useRouter();
  const { submissionId } = router.query;

  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submissionId) {
      // In real app, get form from submission
      // For now, mock it
    }
  }, [submissionId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/public/form/${submissionId}/submit`, {
        data: formData,
      });
      setSubmitted(true);
    } catch (error) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <nav style={{
          background: 'white',
          padding: '20px 40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>📋 Form Submission</h1>
        </nav>
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{
            background: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#4CAF50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '30px',
              color: 'white'
            }}>✓</div>
            <h2 style={{ fontSize: '28px', margin: '0 0 10px 0', color: '#333' }}>Form Submitted!</h2>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Thank you for completing the form. Your information has been received.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>📋 Complete Form</h1>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#333' }}>Please fill out the required information</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            This form is related to your recent booking. Please provide accurate information.
          </p>

          <form onSubmit={submit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Your Response *
              </label>
              <textarea
                placeholder="Enter your detailed response here..."
                onChange={(e) => setFormData({ response: e.target.value })}
                required
                rows={8}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              padding: '12px',
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#856404',
              fontSize: '14px'
            }}>
              ⚠️ Please review your information before submitting. You won't be able to edit it later.
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: loading ? '#ccc' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Submitting...' : 'Submit Form'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
