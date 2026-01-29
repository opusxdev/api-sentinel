import { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import { analyticsAPI } from '../api/analytics';
import { Button } from '../components/Button';

export const Dashboard = () => {
  const { endpoints, fetchEndpoints } = useStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch endpoints and stats on component mount
    const loadData = async () => {
      setLoading(true);
      await fetchEndpoints();
      try {
        const { data } = await analyticsAPI.getDashboard();
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
      setLoading(false);
    };
    
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const summary = stats?.summary || {
    totalEndpoints: endpoints.length,
    upEndpoints: endpoints.filter(e => e.status === 'up').length,
    downEndpoints: endpoints.filter(e => e.status === 'down').length,
    avgResponseTime: 0
  };

  return (
    <>
      <div className="mb-24">
        <h1>Overview</h1>
        <p>Monitor your API endpoints at a glance</p>
      </div>

      <div className="metrics">
        <div className="card">
          <div className="stat">
            <div className="stat-value">{summary.totalEndpoints}</div>
            <div className="stat-label">Total Endpoints</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-value">{summary.upEndpoints}</div>
            <div className="stat-label">Online</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-value">{summary.downEndpoints}</div>
            <div className="stat-label">Offline</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-value">{summary.avgResponseTime}ms</div>
            <div className="stat-label">Avg Response</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-16">Quick Stats</h2>
        <div className="stats-container">
          {stats?.endpoints && stats.endpoints.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="stat-detail-item">
                <span style={{ color: '#999', fontSize: '14px' }}>Most Active Endpoint</span>
                <span style={{ fontSize: '16px', fontWeight: '500', marginTop: '8px' }}>{stats.endpoints[0]?.name || 'N/A'}</span>
                <span style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>{stats.endpoints[0]?.url}</span>
              </div>
              <div className="stat-detail-item">
                <span style={{ color: '#999', fontSize: '14px' }}>Recent Incidents (24h)</span>
                <span style={{ fontSize: '16px', fontWeight: '500', marginTop: '8px' }}>{stats.recentIncidents?.length || 0}</span>
                {stats.recentIncidents?.length > 0 && (
                  <span style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                    Last: {new Date(stats.recentIncidents[0]?.checkedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="stat-detail-item">
                <span style={{ color: '#999', fontSize: '14px' }}>Overall Uptime (24h)</span>
                <span style={{ fontSize: '16px', fontWeight: '500', marginTop: '8px' }}>{stats.summary?.overallUptime || 0}%</span>
              </div>
              <div className="stat-detail-item">
                <span style={{ color: '#999', fontSize: '14px' }}>Degraded Endpoints</span>
                <span style={{ fontSize: '16px', fontWeight: '500', marginTop: '8px' }}>{stats.summary?.degradedEndpoints || 0}</span>
              </div>
            </div>
          ) : (
            <div className="empty">
              <p className="empty-text">No data available yet. Add endpoints to get started.</p>
              <Button variant="primary" href="/endpoints">
                Go to Endpoints
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};