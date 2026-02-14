import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return <>{children}</>;

  const isOwner = user.role === 'OWNER';
  const currentPath = router.pathname;

  const navItems = isOwner ? [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '🛠️', label: 'Services', path: '/services' },
    { icon: '📦', label: 'Inventory', path: '/inventory' },
    { icon: '🔌', label: 'Integrations', path: '/integrations' },
    { icon: '👥', label: 'Staff', path: '/staff-management' },
    { icon: '💬', label: 'Inbox', path: '/inbox' },
  ] : [
    { icon: '📊', label: 'Dashboard', path: '/staff-dashboard' },
    { icon: '💬', label: 'Inbox', path: '/inbox' },
    { icon: '📅', label: 'Bookings', path: '/staff-bookings' },
    { icon: '📝', label: 'Forms', path: '/staff-forms' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>🚀 CareOps</h2>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{user.workspaceName}</p>
        </div>
        
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              style={{
                display: 'block',
                padding: '12px 16px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                marginBottom: '8px',
                background: currentPath === item.path ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                fontWeight: currentPath === item.path ? '600' : '400',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', opacity: 0.8 }}>
            {user.email}
          </p>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: '#f5f7fa', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
