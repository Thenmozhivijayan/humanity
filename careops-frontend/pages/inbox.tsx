import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

type Message = {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  contact: { name?: string; email?: string; phone?: string };
  messages: Message[];
  automated: boolean;
};

export default function InboxPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadInbox();
    }
  }, [user, authLoading, router]);

  const loadInbox = async () => {
    try {
      const res = await api.get(`/inbox?workspaceId=${user?.workspaceId}`);
      setConversations(res.data);
    } catch (error) {
      console.error('Failed to load inbox', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!selected || !reply) return;

    try {
      await api.post(`/inbox/${selected}/reply`, { content: reply });
      setReply("");
      loadInbox();
    } catch (error) {
      alert('Failed to send reply');
    }
  };

  if (authLoading || loading) {
    return <Layout><div style={{ padding: 40 }}>Loading...</div></Layout>;
  }

  if (!user) {
    return null;
  }

  const selectedConv = conversations.find((c) => c.id === selected);

  return (
    <Layout>
      <div style={{ display: "flex", height: "calc(100vh - 0px)", background: '#f5f7fa' }}>
        {/* Conversation List */}
        <div style={{
          width: 350,
          background: 'white',
          borderRight: "1px solid #e0e0e0",
          overflow: "auto",
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: 25,
            borderBottom: '2px solid #e0e0e0',
            background: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px' }}>💬 Inbox</h2>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>

          {conversations.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
              <p>No conversations yet</p>
            </div>
          )}

          {conversations.map((conv) => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const isUnread = lastMsg?.sender === 'CUSTOMER';
            
            return (
              <div
                key={conv.id}
                onClick={() => setSelected(conv.id)}
                style={{
                  padding: 20,
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  background: selected === conv.id ? "#f0f4ff" : "white",
                  borderLeft: selected === conv.id ? '4px solid #667eea' : '4px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selected !== conv.id) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selected !== conv.id) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <strong style={{ fontSize: 16, color: '#333' }}>
                    {conv.contact.name || conv.contact.email || conv.contact.phone}
                  </strong>
                  {isUnread && (
                    <span style={{
                      width: 10,
                      height: 10,
                      background: '#ef4444',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }} />
                  )}
                </div>
                <p style={{
                  fontSize: 14,
                  color: "#666",
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {lastMsg?.content || 'No messages'}
                </p>
                {!conv.automated && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: 8,
                    padding: '4px 8px',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: 11,
                    borderRadius: 4,
                    fontWeight: '600'
                  }}>
                    ⚠️ Manual Mode
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: 'white' }}>
          {selectedConv ? (
            <>
              <div style={{
                padding: 25,
                borderBottom: "2px solid #e0e0e0",
                background: 'white'
              }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
                  {selectedConv.contact.name || selectedConv.contact.email || selectedConv.contact.phone}
                </h3>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {selectedConv.contact.email && (
                    <span style={{ fontSize: 14, color: '#666' }}>📧 {selectedConv.contact.email}</span>
                  )}
                  {selectedConv.contact.phone && (
                    <span style={{ fontSize: 14, color: '#666' }}>📱 {selectedConv.contact.phone}</span>
                  )}
                </div>
              </div>

              <div style={{
                flex: 1,
                overflow: "auto",
                padding: 25,
                background: '#f9fafb'
              }}>
                {selectedConv.messages.map((msg) => {
                  const isStaff = msg.sender === "STAFF";
                  const isSystem = msg.sender === "SYSTEM";
                  
                  return (
                    <div
                      key={msg.id}
                      style={{
                        marginBottom: 20,
                        display: 'flex',
                        justifyContent: isStaff ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isStaff ? 'flex-end' : 'flex-start'
                      }}>
                        <span style={{
                          fontSize: 11,
                          color: '#999',
                          marginBottom: 5,
                          fontWeight: '600'
                        }}>
                          {isStaff ? '👤 You' : isSystem ? '🤖 System' : '👥 Customer'}
                        </span>
                        <div
                          style={{
                            padding: '12px 16px',
                            borderRadius: 12,
                            background: isStaff
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : isSystem
                              ? '#f3f4f6'
                              : 'white',
                            color: isStaff ? 'white' : '#333',
                            boxShadow: isStaff ? '0 2px 8px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                            border: isSystem ? '1px solid #e5e7eb' : 'none'
                          }}
                        >
                          <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                padding: 25,
                borderTop: "2px solid #e0e0e0",
                background: 'white'
              }}>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  style={{
                    width: "100%",
                    padding: 15,
                    height: 100,
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim()}
                  style={{
                    marginTop: 15,
                    padding: "12px 30px",
                    background: reply.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: reply.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    fontSize: 16
                  }}
                >
                  📤 Send Reply
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#999'
            }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>💬</div>
              <p style={{ fontSize: 18, margin: 0 }}>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
