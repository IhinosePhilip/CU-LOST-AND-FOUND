import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>My Profile</h1>
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h2>{user.fullName}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Department:</strong> {user.department}</p>
          <p><strong>Level:</strong> {user.level}</p>
          <p><strong>Reputation:</strong> {user.reputation || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
