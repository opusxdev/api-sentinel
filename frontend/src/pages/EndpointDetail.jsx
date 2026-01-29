import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { analyticsAPI } from '../api/analytics';
import { Button } from '../components/Button';
import { Table } from '../components/Table';

export const EndpointDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedEndpoint, fetchEndpoint, deleteEndpoint, toggleEndpoint, clearSelectedEndpoint } = useStore();
  const [stats, setStats] = useState(null);
  const [checks, setChecks] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);

  const getHealthStatus = () => {
    if (!stats) return 'critical';
    const uptime = stats.uptime || 0;
    const avgResponseTime = stats.avgResponseTime || 0;
    const failureRate = stats.totalChecks > 0 ? (stats.failedChecks / stats.totalChecks) * 100 : 0;

    // Red (Critical): uptime < 90% or failure rate > 10% or response time > 1000ms
    if (uptime < 90 || failureRate > 10 || avgResponseTime > 1000) return 'critical';
    // Orange (Warning): uptime < 95% or failure rate > 5% or response time > 500ms
    if (uptime < 95 || failureRate > 5 || avgResponseTime > 500) return 'warning';
    // Yellow (Degraded): uptime < 99% or failure rate > 2% or response time > 250ms
    if (uptime < 99 || failureRate > 2 || avgResponseTime > 250) return 'degraded';
    // Green (Healthy): everything is good
    return 'healthy';
  };

  useEffect(() => {
    setIsLoading(true);
    fetchEndpoint(id)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading endpoint:', error);
        setIsLoading(false);
      });
  }, [id, fetchEndpoint]);

  useEffect(() => {
    return () => {
      clearSelectedEndpoint();
    };
  }, [clearSelectedEndpoint]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, checksRes] = await Promise.all([
          analyticsAPI.getEndpointStats(id, { timeRange }),
          analyticsAPI.getEndpointChecks(id, { timeRange, limit: 20 })
        ]);
        setStats(statsRes.data.data);
        setChecks(checksRes.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [id, timeRange]);

  const handleDelete = async () => {
    if (window.confirm('Delete this endpoint?')) {
      try {
        await deleteEndpoint(id);
        navigate('/dashboard/endpoints');
      } catch (err) {
        alert('Failed to delete endpoint');
      }
    }
  };

  const handleToggle = async () => {
    try {
      await toggleEndpoint(id);
    } catch (err) {
      alert('Failed to toggle endpoint');
    }
  };

  if (isLoading || !selectedEndpoint) {
    return <div className="loading">Loading endpoint details...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-24">
        <div>
          <Button onClick={() => navigate('/dashboard/endpoints')}>← Back</Button>
          <div className="health-indicator" style={{ marginTop: '16px' }}>
            <div className={`health-dot ${getHealthStatus()}`}></div>
            <h1>{selectedEndpoint.name}</h1>
          </div>
          <p className="font-mono">{selectedEndpoint.url}</p>
        </div>
        <div className="flex gap-8">
          <Button onClick={handleToggle}>
            {selectedEndpoint.isActive ? 'Disable' : 'Enable'}
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="flex gap-8 mb-24">
        {['1h', '24h', '7d', '14d', '30d'].map(range => (
          <Button
            key={range}
            variant={timeRange === range ? 'primary' : 'default'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      <div className="metrics">
        <div className="card">
          <div className="stat">
            <div className="stat-value">{stats?.uptime || 0}%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-value">{stats?.avgResponseTime || 0}ms</div>
            <div className="stat-label">Avg Response</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-value">{stats?.totalChecks || 0}</div>
            <div className="stat-label">Total Checks</div>
          </div>
        </div>
        <div className="card">
          <div className="stat">
            <div className="stat-value">{stats?.failedChecks || 0}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-16">Recent Checks</h2>
        <Table headers={['Time', 'Status', 'Response', 'Code']}>
          {checks.map((check, i) => (
            <tr key={i}>
              <td className="font-mono text-sm">
                {new Date(check.checkedAt).toLocaleString()}
              </td>
              <td>
                <div className="status">
                  <span className={`status-dot ${check.status === 'success' ? 'success' : 'failure'}`}></span>
                  <span>{check.status}</span>
                </div>
              </td>
              <td className="font-mono">{check.responseTime}ms</td>
              <td>{check.statusCode || '—'}</td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  );
};
