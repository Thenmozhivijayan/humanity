import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

export default function IntegrationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [type, setType] = useState("EMAIL");

  const [emailHost, setEmailHost] = useState("smtp.gmail.com");
  const [emailPort, setEmailPort] = useState("587");
  const [emailUser, setEmailUser] = useState("");
  const [emailPass, setEmailPass] = useState("");

  const [smsAccountSid, setSmsAccountSid] = useState("");
  const [smsAuthToken, setSmsAuthToken] = useState("");
  const [smsFrom, setSmsFrom] = useState("");

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <Layout><div style={{ padding: 40 }}>Loading...</div></Layout>;
  }

  if (!user) {
    return null;
  }

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const config =
      type === "EMAIL"
        ? { host: emailHost, port: emailPort, user: emailUser, pass: emailPass }
        : { accountSid: smsAccountSid, authToken: smsAuthToken, from: smsFrom };

    try {
      const res = await api.post("/integrations/test", { type, config });
      setTestResult(res.data);
    } catch (error) {
      setTestResult({ success: false, error: "Test failed" });
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    const config =
      type === "EMAIL"
        ? { host: emailHost, port: emailPort, user: emailUser, pass: emailPass, from: emailUser }
        : { accountSid: smsAccountSid, authToken: smsAuthToken, from: smsFrom };

    try {
      await api.post(`/workspace/${user.workspaceId}/integrations`, {
        type,
        provider: type === "EMAIL" ? "NODEMAILER" : "TWILIO",
        config,
      });
      alert("Integration saved!");
    } catch (error) {
      alert("Failed to save integration");
    }
  };

  return (
    <Layout>
      <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>🔌 Integrations</h1>
          <p style={{ color: "#666", margin: 0 }}>Connect email or SMS to communicate with customers</p>
        </div>

        <div style={{
          padding: 30,
          background: 'white',
          borderRadius: 12,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>Integration Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: "100%",
              padding: '12px 16px',
              marginBottom: 30,
              border: '2px solid #e0e0e0',
              borderRadius: 8,
              fontSize: 16,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="EMAIL">📧 Email (SMTP)</option>
            <option value="SMS">📱 SMS (Twilio)</option>
          </select>

          {type === "EMAIL" && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>SMTP Host</label>
                <input
                  placeholder="smtp.gmail.com"
                  value={emailHost}
                  onChange={(e) => setEmailHost(e.target.value)}
                  style={{
                    width: "100%",
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Port</label>
                <input
                  placeholder="587"
                  value={emailPort}
                  onChange={(e) => setEmailPort(e.target.value)}
                  style={{
                    width: "100%",
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Email Address</label>
                <input
                  placeholder="your-email@gmail.com"
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                  style={{
                    width: "100%",
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Password / App Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={emailPass}
                  onChange={(e) => setEmailPass(e.target.value)}
                  style={{
                    width: "100%",
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {type === "SMS" && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Twilio Account SID</label>
                <input
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={smsAccountSid}
                  onChange={(e) => setSmsAccountSid(e.target.value)}
                  style={{
                    width: "100%",
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Twilio Auth Token</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={smsAuthToken}
                  onChange={(e) => setSmsAuthToken(e.target.value)}
                  style={{
                    width: "100%",
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>From Phone Number</label>
                <input
                  placeholder="+1234567890"
                  value={smsFrom}
                  onChange={(e) => setSmsFrom(e.target.value)}
                  style={{
                    width: "100%",
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
            <button
              onClick={testConnection}
              disabled={testing}
              style={{
                flex: 1,
                padding: '14px',
                background: testing ? '#ccc' : 'white',
                color: testing ? 'white' : '#667eea',
                border: '2px solid #667eea',
                borderRadius: 8,
                cursor: testing ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: 16
              }}
            >
              {testing ? '🔄 Testing...' : '🧪 Test Connection'}
            </button>

            <button
              onClick={save}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: 16
              }}
            >
              💾 Save Integration
            </button>
          </div>

          {testResult && (
            <div
              style={{
                marginTop: 20,
                padding: 15,
                background: testResult.success ? "#f0fdf4" : "#fef2f2",
                border: `2px solid ${testResult.success ? '#86efac' : '#fca5a5'}`,
                borderRadius: 8,
                color: testResult.success ? '#166534' : '#991b1b',
                fontWeight: '500'
              }}
            >
              {testResult.success ? "✓ Connection successful!" : `✗ ${testResult.error}`}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
