import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../src/lib/api";
import { useAuth } from "../src/context/AuthContext";
import Layout from "../src/components/Layout";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
};

export default function InventoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");
  const [unit, setUnit] = useState("pieces");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadInventory();
    }
  }, [user, authLoading, router]);

  const loadInventory = async () => {
    try {
      const res = await api.get(`/workspace/${user?.workspaceId}/inventory`);
      setItems(res.data);
    } catch (error) {
      console.error('Failed to load inventory', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!name || !quantity || !threshold) return;
    try {
      await api.post(`/workspace/${user?.workspaceId}/inventory`, {
        name,
        quantity: parseInt(quantity),
        threshold: parseInt(threshold),
        unit,
      });
      setName("");
      setQuantity("");
      setThreshold("");
      loadInventory();
    } catch (error) {
      alert('Failed to add item');
    }
  };

  const useItem = async (id: string, amount: number) => {
    await api.patch(`/inventory/${id}/use`, { amount });
    loadInventory();
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
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>📦 Inventory</h1>
          <p style={{ color: "#666", margin: 0 }}>Track and manage your stock levels</p>
        </div>

        <div style={{
          marginBottom: 30,
          padding: 30,
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>➕ Add New Item</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 15, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Item Name</label>
              <input
                placeholder="Gloves, Masks, etc."
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
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Quantity</label>
              <input
                placeholder="100"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Threshold</label>
              <input
                placeholder="10"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
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
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#333' }}>Unit</label>
              <input
                placeholder="pieces"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
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
            <button
              onClick={addItem}
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
              Add Item
            </button>
          </div>
        </div>

        <h3 style={{ marginBottom: 20, fontSize: '24px' }}>Current Stock</h3>

        {items.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e0e0e0'
          }}>
            <p style={{ fontSize: 18, color: '#666' }}>No inventory items yet.</p>
            <p style={{ color: '#999' }}>Add your first item above</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 15 }}>
          {items.map((item) => {
            const isLow = item.quantity <= item.threshold;
            const percentage = (item.quantity / (item.threshold * 2)) * 100;
            return (
              <div
                key={item.id}
                style={{
                  padding: 25,
                  border: `2px solid ${isLow ? "#fca5a5" : "#e0e0e0"}`,
                  borderRadius: 12,
                  background: isLow ? "#fef2f2" : "white",
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <strong style={{ fontSize: 20 }}>{item.name}</strong>
                      {isLow && (
                        <span style={{
                          padding: '4px 12px',
                          background: '#dc2626',
                          color: 'white',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: '600'
                        }}>
                          ⚠️ LOW STOCK
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 15 }}>
                      <p style={{ margin: 0, fontSize: 36, fontWeight: "bold", color: isLow ? '#dc2626' : '#333' }}>
                        {item.quantity}
                      </p>
                      <span style={{ fontSize: 18, color: '#666' }}>{item.unit}</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 8,
                      background: '#e0e0e0',
                      borderRadius: 4,
                      overflow: 'hidden',
                      marginBottom: 8
                    }}>
                      <div style={{
                        width: `${Math.min(percentage, 100)}%`,
                        height: '100%',
                        background: isLow ? '#dc2626' : '#10b981',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                      Alert threshold: {item.threshold} {item.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => useItem(item.id, 1)}
                    style={{
                      padding: "12px 24px",
                      background: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: '600',
                      fontSize: 16,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#5568d3'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
                  >
                    Use 1
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
