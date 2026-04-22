import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>My Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user.fullName}!</p>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📤</div>
            <div className="stat-info">
              <h3>{user.itemsReported?.length || 0}</h3>
              <p>Items Reported</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📥</div>
            <div className="stat-info">
              <h3>{user.itemsClaimed?.length || 0}</h3>
              <p>Items Claimed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{user.reputation || 0}</h3>
              <p>Reputation Score</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <a href="/report-lost" className="action-card">
              <span className="action-icon">🔍</span>
              <h3>Report Lost Item</h3>
              <p>Lost something? Create a report</p>
            </a>

            <a href="/report-found" className="action-card">
              <span className="action-icon">✅</span>
              <h3>Report Found Item</h3>
              <p>Found something? Help the owner</p>
            </a>

            <a href="/browse" className="action-card">
              <span className="action-icon">📋</span>
              <h3>Browse Items</h3>
              <p>Search for your lost items</p>
            </a>
          </div>
        </div>

        {/* Recent Items */}
        <div className="recent-items">
          <h2>My Recent Items</h2>
          {user.itemsReported && user.itemsReported.length > 0 ? (
            <div className="items-list">
              {user.itemsReported.slice(0, 5).map(item => (
                <div key={item._id} className="item-row">
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <span className={`badge badge-${item.type}`}>
                      {item.type}
                    </span>
                    <span className={`badge badge-${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                  <a href={`/item/${item._id}`} className="btn btn-outline btn-sm">
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't reported any items yet</p>
              <a href="/report-lost" className="btn btn-primary">
                Report Your First Item
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
