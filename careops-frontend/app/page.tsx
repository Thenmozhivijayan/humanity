'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../src/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: 600,
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🚀</div>
          <h1 style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 20px 0',
            textShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            CareOps
          </h1>
          <p style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            fontWeight: '300'
          }}>
            Unified Operations Platform for Service Businesses
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 30
        }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '18px 40px',
              fontSize: 18,
              fontWeight: '600',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              minWidth: 200
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}>
              🔐 Login
            </button>
          </Link>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '18px 40px',
              fontSize: 18,
              fontWeight: '600',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: 12,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              minWidth: 200
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#667eea';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}>
              ✨ Register as Owner
            </button>
          </Link>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 15 }}>or</p>

        <Link href="/customer/register" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '14px 30px',
            fontSize: 16,
            fontWeight: '600',
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
          }}>
            👤 Register as Customer
          </button>
        </Link>
      </div>
    </div>
  );
}
