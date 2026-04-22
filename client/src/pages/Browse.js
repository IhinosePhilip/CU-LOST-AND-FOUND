import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './Browse.css';

const Browse = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    location: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Phone', 'Laptop', 'Tablet', 'Charger', 'Headphones', 'Wallet',
    'ID Card', 'Keys', 'Bag', 'Book', 'Jewelry', 'Clothing',
    'Watch', 'Glasses', 'Water Bottle', 'Calculator', 'USB Drive',
    'Other Electronics', 'Other'
  ];

  const locations = [
    'Chapel', 'Library', 'Cafeteria', 'Sports Complex', 'Male Hostel',
    'Female Hostel', 'College of Science & Technology',
    'College of Business & Social Sciences', 'College of Engineering',
    'College of Development Studies', 'Lecture Theatre', 'Security Office',
    'Admin Block', 'Parking Lot', 'Other'
  ];

  useEffect(() => {
    fetchItems();
  }, [filters, page]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      const res = await axios.get('/api/items', { params });
      setItems(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      location: '',
      search: ''
    });
    setPage(1);
  };

  const formatDate = (date) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffTime = Math.abs(now - itemDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="browse-page">
      <div className="container">
        <h1>Browse Items</h1>
        <p className="page-subtitle">Search through lost and found items on campus</p>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-header">
            <FiFilter /> Filters
          </div>
          <form onSubmit={handleSearch} className="filters-form">
            <div className="filter-row">
              <select
                name="type"
                className="form-select"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>

              <select
                name="category"
                className="form-select"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                name="location"
                className="form-select"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="search-row">
              <div className="search-input-group">
                <FiSearch />
                <input
                  type="text"
                  name="search"
                  className="form-input"
                  placeholder="Search by keyword..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Search</button>
              <button type="button" className="btn btn-outline" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="spinner"></div>
        ) : items.length === 0 ? (
          <div className="no-results">
            <p>No items found matching your criteria</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="items-grid">
              {items.map(item => (
                <Link to={`/item/${item._id}`} key={item._id} className="item-card">
                  <div className="item-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} />
                    ) : (
                      <div className="item-placeholder">
                        {item.category === 'Phone' && '📱'}
                        {item.category === 'Laptop' && '💻'}
                        {item.category === 'Wallet' && '👛'}
                        {item.category === 'Keys' && '🔑'}
                        {item.category === 'Bag' && '🎒'}
                        {!['Phone', 'Laptop', 'Wallet', 'Keys', 'Bag'].includes(item.category) && '📦'}
                      </div>
                    )}
                  </div>
                  <div className="item-content">
                    <h3>{item.title}</h3>
                    <div className="item-badges">
                      <span className={`badge badge-${item.type}`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className={`badge badge-${item.status}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="item-location">📍 {item.location}</p>
                    <p className="item-date">🕐 {formatDate(item.createdAt)}</p>
                    {item.reportedBy && (
                      <p className="item-reporter">
                        👤 {item.reportedBy.fullName}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
