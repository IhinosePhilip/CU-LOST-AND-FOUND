import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReportItem.css';

const ReportLost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'lost',
    category: '',
    title: '',
    description: '',
    color: '',
    brand: '',
    location: '',
    specificLocation: '',
    dateLostOrFound: '',
    verificationDetails: ''
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/items', formData);
      toast.success('Item reported successfully!');
      
      if (res.data.matchesFound > 0) {
        toast.info(`Found ${res.data.matchesFound} potential matches!`);
      }
      
      navigate(`/item/${res.data.item._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <div className="container">
        <div className="report-container">
          <h1>Report Lost Item</h1>
          <p className="page-subtitle">
            Fill in the details about your lost item. The more information you provide, 
            the better chance of finding it.
          </p>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder='e.g., "Black iPhone 13 Pro"'
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe your item in detail. Include brand, color, distinguishing features, etc."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="color"
                  className="form-input"
                  placeholder="e.g., Black, Blue, Red"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className="form-input"
                  placeholder="e.g., Apple, Samsung, HP"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Where did you lose it? *</label>
              <select
                name="location"
                className="form-select"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Specific Location</label>
              <input
                type="text"
                name="specificLocation"
                className="form-input"
                placeholder='e.g., "Near the entrance, 2nd floor"'
                value={formData.specificLocation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">When did you lose it? *</label>
              <input
                type="date"
                name="dateLostOrFound"
                className="form-input"
                value={formData.dateLostOrFound}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Verification Detail (Hidden from public)</label>
              <input
                type="text"
                name="verificationDetails"
                className="form-input"
                placeholder='Something only you know, e.g., "Lock screen wallpaper is a beach photo"'
                value={formData.verificationDetails}
                onChange={handleChange}
              />
              <small>This helps verify ownership when someone claims your item</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;
