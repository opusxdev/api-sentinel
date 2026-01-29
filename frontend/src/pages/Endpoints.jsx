import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

export const Endpoints = () => {
  const navigate = useNavigate();
  const { endpoints, fetchEndpoints, createEndpoint, deleteEndpoint } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    checkInterval: 5
  });

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEndpoint(formData);
      setShowModal(false);
      setFormData({ name: '', url: '', method: 'GET', checkInterval: 5 });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create endpoint');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this endpoint?')) {
      try {
        await deleteEndpoint(id);
      } catch (err) {
        alert('Failed to delete endpoint');
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-24">
        <div>
          <h1>Endpoints</h1>
          <p>Manage your monitored API endpoints</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Endpoint
        </Button>
      </div>

      <div className="card">
        <h2 className="mb-16">All Endpoints</h2>
        {endpoints.length === 0 ? (
          <div className="empty">
            <p className="empty-text">No endpoints yet</p>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add your first endpoint
            </Button>
          </div>
        ) : (
          <div>
            {endpoints.map(endpoint => (
              <div
                key={endpoint._id}
                className="endpoint-item"
                onClick={() => navigate(`/dashboard/endpoints/${endpoint._id}`)}
              >
                <div className="endpoint-header">
                  <div>
                    <div className="flex items-center gap-8">
                      <div className="status">
                        <span className={`status-dot ${endpoint.status}`}></span>
                        <span>{endpoint.status === 'up' ? 'Online' : 'Offline'}</span>
                      </div>
                      <h3>{endpoint.name}</h3>
                    </div>
                    <div className="endpoint-url">{endpoint.url}</div>
                  </div>
                  <div className="flex gap-8">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(endpoint._id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="endpoint-stats">
                  <div>
                    <span className="text-gray">Method:</span> {endpoint.method}
                  </div>
                  <div>
                    <span className="text-gray">Response:</span> {endpoint.lastResponseTime}ms
                  </div>
                  <div>
                    <span className="text-gray">Interval:</span> {endpoint.checkInterval}min
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Endpoint">
        <form onSubmit={handleCreate}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Production API"
            required
          />
          
          <Input
            label="URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://api.example.com/health"
            required
          />
          
          <div className="form-group">
            <label className="label">Method</label>
            <select
              className="input"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          
          <Input
            label="Check Interval (minutes)"
            type="number"
            value={formData.checkInterval}
            onChange={(e) => setFormData({ ...formData, checkInterval: parseInt(e.target.value) })}
            required
          />
          
          <div className="flex gap-8 mt-16">
            <Button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Endpoint
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
