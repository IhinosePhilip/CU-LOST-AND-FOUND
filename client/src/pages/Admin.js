import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiPackage, FiDownload, FiRefreshCw, FiTrash2, FiSearch } from 'react-icons/fi';
import './Admin.css';

/* ─── helpers ─────────────────────────────────────────── */
const fmt = (date) =>
  date ? new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—';

const Pill = ({ value, map }) => {
  const cls = map[value] || 'pill-user';
  return <span className={`pill ${cls}`}>{value || '—'}</span>;
};

/* ─── Export helpers ──────────────────────────────────── */
const exportToExcel = (data, sheetName, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((r) => String(r[key] ?? '').length)) + 2
  }));
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName);
};

/* ─── Stat Card ───────────────────────────────────────── */
const StatCard = ({ icon, label, value, color }) => (
  <div className={`admin-stat-card ${color}`}>
    <span className="stat-icon-sm">{icon}</span>
    <div className="stat-text">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════ */
/*  USERS TABLE                                            */
/* ═══════════════════════════════════════════════════════ */
const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const levels = ['100', '200', '300', '400', '500', 'Postgraduate', 'Staff'];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users', {
        params: { search, level: levelFilter, page, limit: 50 }
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, levelFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleExport = () => {
    if (!users.length) return toast.warn('No data to export');
    const rows = users.map((u, i) => ({
      '#': i + 1,
      'Full Name': u.fullName,
      'Email': u.email,
      'Phone': u.phoneNumber,
      'Department': u.department,
      'Level': u.level,
      'Role': u.role,
      'Verified': u.verified ? 'Yes' : 'No',
      'Items Reported': u.itemsReported?.length ?? 0,
      'Joined': fmt(u.createdAt)
    }));
    exportToExcel(rows, 'Users', `CU_LostFound_Users_${Date.now()}.xlsx`);
    toast.success('Exported to Excel!');
  };

  return (
    <>
      <div className="table-toolbar">
        <div className="toolbar-filters">
          <input
            placeholder="🔍  Search name, email, dept..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}>
            <option value="">All Levels</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="toolbar-actions">
          <span className="record-count">{total} records</span>
          <button className="btn-export" onClick={handleExport}>
            <FiDownload /> Export Excel
          </button>
          <button className="btn-export" style={{ background: '#6B46C1' }} onClick={fetchUsers}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="table-loading"><div className="spinner" /></div>
        ) : users.length === 0 ? (
          <div className="table-empty">
            <FiSearch size={40} />
            <p>No users found</p>
          </div>
        ) : (
          <table className="spreadsheet">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Level</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Items Reported</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id}>
                  <td className="row-num">{(page - 1) * 50 + i + 1}</td>
                  <td><strong>{u.fullName}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phoneNumber}</td>
                  <td>{u.department}</td>
                  <td>{u.level}</td>
                  <td>
                    <Pill value={u.role} map={{ admin: 'pill-admin', user: 'pill-user' }} />
                  </td>
                  <td>
                    <Pill
                      value={u.verified ? 'verified' : 'unverified'}
                      map={{ verified: 'pill-verified', unverified: 'pill-unverified' }}
                    />
                  </td>
                  <td>{u.itemsReported?.length ?? 0}</td>
                  <td>{fmt(u.createdAt)}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(u._id, u.fullName)}
                        title="Delete user"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-pagination">
        <span className="pagination-info">
          Showing {Math.min((page - 1) * 50 + 1, total)}–{Math.min(page * 50, total)} of {total}
        </span>
        <div className="pagination-btns">
          <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = Math.max(1, page - 2) + i;
            if (p > totalPages) return null;
            return (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            );
          })}
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════ */
/*  ITEMS TABLE                                            */
/* ═══════════════════════════════════════════════════════ */
const ItemsTable = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/items', {
        params: { search, type: typeFilter, status: statusFilter, page, limit: 50 }
      });
      setItems(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete item "${title}"?`)) return;
    try {
      await axios.delete(`/api/admin/items/${id}`);
      toast.success('Item deleted');
      fetchItems();
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/admin/items/${id}/status`, { status });
      toast.success('Status updated');
      fetchItems();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleExport = () => {
    if (!items.length) return toast.warn('No data to export');
    const rows = items.map((item, i) => ({
      '#': i + 1,
      'Type': item.type,
      'Title': item.title,
      'Category': item.category,
      'Color': item.color || '—',
      'Brand': item.brand || '—',
      'Location': item.location,
      'Specific Location': item.specificLocation || '—',
      'Date Lost/Found': fmt(item.dateLostOrFound),
      'Status': item.status,
      'Reported By': item.reportedBy?.fullName || '—',
      'Reporter Email': item.reportedBy?.email || '—',
      'Reporter Dept': item.reportedBy?.department || '—',
      'Claimed By': item.claimedBy?.fullName || '—',
      'Views': item.views,
      'Date Reported': fmt(item.createdAt)
    }));
    exportToExcel(rows, 'Items', `CU_LostFound_Items_${Date.now()}.xlsx`);
    toast.success('Exported to Excel!');
  };

  const statusMap = {
    active: 'pill-active',
    claimed: 'pill-claimed',
    closed: 'pill-closed',
    pending_verification: 'pill-pending'
  };

  return (
    <>
      <div className="table-toolbar">
        <div className="toolbar-filters">
          <input
            placeholder="🔍  Search title, description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="claimed">Claimed</option>
            <option value="closed">Closed</option>
            <option value="pending_verification">Pending</option>
          </select>
        </div>
        <div className="toolbar-actions">
          <span className="record-count">{total} records</span>
          <button className="btn-export" onClick={handleExport}>
            <FiDownload /> Export Excel
          </button>
          <button className="btn-export" style={{ background: '#6B46C1' }} onClick={fetchItems}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="table-loading"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="table-empty">
            <FiSearch size={40} />
            <p>No items found</p>
          </div>
        ) : (
          <table className="spreadsheet">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Title</th>
                <th>Category</th>
                <th>Color</th>
                <th>Location</th>
                <th>Date Lost/Found</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Dept</th>
                <th>Claimed By</th>
                <th>Views</th>
                <th>Date Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item._id}>
                  <td className="row-num">{(page - 1) * 50 + i + 1}</td>
                  <td>
                    <Pill value={item.type} map={{ lost: 'pill-lost', found: 'pill-found' }} />
                  </td>
                  <td title={item.title}><strong>{item.title}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.color || '—'}</td>
                  <td>{item.location}</td>
                  <td>{fmt(item.dateLostOrFound)}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      style={{
                        border: 'none', background: 'transparent',
                        fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem'
                      }}
                    >
                      <option value="active">active</option>
                      <option value="claimed">claimed</option>
                      <option value="closed">closed</option>
                      <option value="pending_verification">pending</option>
                    </select>
                  </td>
                  <td>{item.reportedBy?.fullName || '—'}</td>
                  <td>{item.reportedBy?.department || '—'}</td>
                  <td>{item.claimedBy?.fullName || '—'}</td>
                  <td>{item.views}</td>
                  <td>{fmt(item.createdAt)}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(item._id, item.title)}
                        title="Delete item"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-pagination">
        <span className="pagination-info">
          Showing {Math.min((page - 1) * 50 + 1, total)}–{Math.min(page * 50, total)} of {total}
        </span>
        <div className="pagination-btns">
          <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = Math.max(1, page - 2) + i;
            if (p > totalPages) return null;
            return (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            );
          })}
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════ */
/*  MAIN ADMIN PAGE                                        */
/* ═══════════════════════════════════════════════════════ */
const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      axios.get('/api/admin/stats')
        .then(res => setStats(res.data.stats))
        .catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <div style={{ fontSize: '4rem' }}>🚫</div>
            <h2>Access Denied</h2>
            <p>You need admin privileges to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>🛡️ Admin Dashboard</h1>
            <p>Covenant University Lost &amp; Found — Management Panel</p>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Logged in as <strong>{user.fullName}</strong>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            <StatCard icon="👥" label="Total Users"     value={stats.totalUsers}    color="purple" />
            <StatCard icon="📋" label="Total Items"     value={stats.totalItems}    color="blue"   />
            <StatCard icon="🔍" label="Lost Items"      value={stats.lostItems}     color="red"    />
            <StatCard icon="✅" label="Found Items"     value={stats.foundItems}    color="green"  />
            <StatCard icon="⏳" label="Active"          value={stats.activeItems}   color="blue"   />
            <StatCard icon="🎉" label="Claimed"         value={stats.claimedItems}  color="green"  />
            <StatCard icon="📈" label="Recovery Rate"   value={`${stats.recoveryRate}%`} color="purple" />
            <StatCard icon="🆕" label="New This Week"   value={stats.recentUsers}   color="yellow" />
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <FiUsers /> Users {stats && `(${stats.totalUsers})`}
          </button>
          <button
            className={`tab-btn ${tab === 'items' ? 'active' : ''}`}
            onClick={() => setTab('items')}
          >
            <FiPackage /> Items {stats && `(${stats.totalItems})`}
          </button>
        </div>

        {/* Tables */}
        {tab === 'users' && <UsersTable />}
        {tab === 'items' && <ItemsTable />}

      </div>
    </div>
  );
};

export default Admin;
