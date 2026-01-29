import { NavLink } from 'react-router-dom';
import GitHub from '../assets/GitHub_Invertocat_White.png';

const Icon = ({ type }) => {
  const icons = {
    dashboard: '□',
    endpoints: '▢',
    settings: '⚙'
  };
  return <span style={{ fontSize: '16px' }}>{icons[type] || '·'}</span>;
};

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div style={{ padding: '0 16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '16px', fontWeight: '500' }}>API-Sentinel</h1>
      </div>
      <nav>
        <ul className="nav">
          <li className="nav-item">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <div className="flex items-center gap-8">
                <Icon type="dashboard" />
                <span>Dashboard</span>
              </div>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/endpoints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <div className="flex items-center gap-8">
                <Icon type="endpoints" />
                <span>Endpoints</span>
              </div>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <div className="flex items-center gap-8">
                <Icon type="settings" />
                <span>Settings</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div style={{ marginTop: 'auto', padding: '0 16px', paddingBottom: '16px' }}>
        <a 
          href="https://github.com/yourusername/api-sentinel" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            padding: '8px 12px', 
            background: '#000000',
            border: '1.5px solid rgba(255, 255, 255, 0.5)', 
            color: '#fff',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            // e.target.style.background =  '#0f3460';
            e.target.style.borderColor = 'rgba(202, 202, 202, 0.8)';
            e.target.style.color = '#fafafa';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#031015';
            // e.target.style.borderColor = 'rgba(68, 68, 68, 0.5)';
            e.target.style.color = '#fff';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <img src={GitHub} style={{ width: '14px', height: '14px' }} alt="GitHub" />
          <span style={{backgroundColor: '#000000'}}>STAR THE REPO 🌟 </span>
        </a>
      </div>
    </div>
  );
};