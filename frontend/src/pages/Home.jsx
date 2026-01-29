import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GitHub from '../assets/GitHub_Invertocat_White.png'

export const Home = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { title: 'Real-time Monitoring', desc: '24/7 health checks for all your APIs', icon: '⚡' },
   
    { title: 'Analytics Dashboard', desc: 'Deep insights into API performance', icon: '📊' },
    { title: 'Response Time Tracking', desc: 'Monitor latency and uptime metrics', icon: '⏱️' },
    { title: 'Status History', desc: 'Complete incident timeline and logs', icon: '📈' },
    { title: 'Multi-Protocol Support', desc: 'REST, GraphQL, WebSocket monitoring', icon: '🔌' }, { title: 'Instant Alerts', desc: 'Get notified the moment something breaks', icon: '🔔' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000', 
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Spotlight Effect */}
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
        transition: 'transform 0.1s ease-out',
        zIndex: 1
      }} />

      {/* Navigation */}
      <nav style={{ 
        padding: '20px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.5px' }}>
          API-Sentinel
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a 
            
            href="https://github.com/yourusername/api-sentinel" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              padding: '8px 14px', 
              background: '#0f3460',
              
              color: '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '200',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              display: 'flex',
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
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '10px 24px', 
              background: 'transparent', 
              border: '1px solid #333', 
              color: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#fff'}
            onMouseLeave={(e) => e.target.style.borderColor = '#333'}
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{ 
              padding: '10px 24px', 
              background: '#fff', 
              border: 'none', 
              color: '#000',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#ddd'}
            onMouseLeave={(e) => e.target.style.background = '#fff'}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ 
        padding: '100px 40px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: '700', 
          marginBottom: '24px',
          letterSpacing: '-2px',
          lineHeight: '1.1',
          background: 'linear-gradient(to bottom, #fff 30%, #666 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Monitor your APIs live 
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#888', 
          maxWidth: '600px', 
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Real-time health monitoring, and deep analytics for your critical API infrastructure
        </p>
        <button 
          onClick={() => navigate('/register')}
          style={{ 
            padding: '16px 40px', 
            background: '#fff', 
            border: 'none', 
            color: '#000',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 30px rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(255,255,255,0.1)';
          }}
        >
          Start Monitoring Free →
        </button>
      </div>

      {/* Bento Grid */}
      <div style={{ 
        padding: '60px 40px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        {features.map((feature, i) => (
          <div 
            key={i}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '32px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              {feature.title}
            </h3>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div style={{ 
        padding: '100px 40px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px'
        }}>
          <div>
            <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>99.9%</div>
            <div style={{ color: '#888' }}>Uptime</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>&lt;50ms</div>
            <div style={{ color: '#888' }}>Response Time</div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>24/7</div>
            <div style={{ color: '#888' }}>Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};
