import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { Button } from '../components/Button';
import GitHub from '../assets/GitHub_Invertocat_White.png';

export const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="mb-24">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="card">
        <h2 className="mb-16">Account Information</h2>
        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-label">Email</div>
            <div className="setting-value">{user?.email || 'N/A'}</div>
          </div>
          {user?.name && (
            <div className="setting-item">
              <div className="setting-label">Name</div>
              <div className="setting-value">{user.name}</div>
            </div>
          )}
          <div className="setting-item">
            <div className="setting-label">Account Status</div>
            <div className="setting-value">
              <span className="status-badge active">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-16">Preferences</h2>
        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-label">Dashboard Refresh Interval</div>
            <div className="setting-value">30 seconds</div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Health Check Interval</div>
            <div className="setting-value">Configurable per endpoint</div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Notifications</div>
            <div className="setting-value">Enabled</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-16">Session & Security</h2>
        <div className="settings-section">
          <Button variant="danger" onClick={() => setShowLogoutConfirm(true)}>
            Logout
          </Button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Logout?</h2>
            <p>Are you sure you want to logout?</p>
            <div className="flex gap-8 mt-16">
              <Button onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Button */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a 
          href="https://github.com/yourusername/api-sentinel" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            padding: '8px 14px', 
            background: '#0f3460',
            border: '1.5px solid rgba(255, 215, 0, 0.5)', 
            color: '#fff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '200',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#1a5971';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            e.target.style.color = '#fafafa';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#0f3460';
            e.target.style.borderColor = 'rgba(255, 215, 0, 0.5)';
            e.target.style.color = '#fff';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <img src={GitHub} style={{ width: '16px', height: '16px' }}></img> Contribute Here!
        </a>
      </div>
    </>
  );
};
