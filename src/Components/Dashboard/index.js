import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [friendRecommendations, setFriendRecommendations] = useState([]);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        navigate('/'); // Redirect to login if token is not found
        return;
      }

      const [userResponse, filteredUsersResponse, friendsOfFriendsResponse] = await Promise.all([
        axios.get('https://tutedude-backend-1.onrender.com/api/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://tutedude-backend-1.onrender.com/api/filtered-users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://tutedude-backend-1.onrender.com/api/friends-of-friends', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUserDetails(userResponse.data.currentUser);
      setUsers(filteredUsersResponse.data.users);
      setFriendRecommendations(friendsOfFriendsResponse.data.recommendations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/'); // Redirect to login if token is not found
    } else {
      fetchData();
    }
  }, [navigate]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSendRequest = async (userId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('You need to log in first!');
        return;
      }

      await axios.post(
        'https://tutedude-backend-1.onrender.com/api/add-friend-request',
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error('Error sending friend request:', err);
      alert('Error sending friend request');
    }
  };

  const handleAcceptRequest = async (friendId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('You need to log in first!');
        return;
      }

      await axios.post(
        'https://tutedude-backend-1.onrender.com/api/accept-friend-request',
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error('Error accepting friend request:', err);
      alert('Error accepting friend request');
    }
  };

  const handleRejectRequest = async (friendId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('You need to log in first!');
        return;
      }

      await axios.post(
        'https://tutedude-backend-1.onrender.com/api/reject-friend-request',
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      alert('Error rejecting friend request');
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Dashboard</h2>
      {loading ? (
        <p className="empty-message">Loading...</p>
      ) : (
        <>
          {userDetails && (
            <div>
              <h3 className="section-header">Your Friends</h3>
              <ul className="user-list">
                {userDetails.friends.length === 0 ? (
                  <p className="empty-message">No friends yet</p>
                ) : (
                  userDetails.friends.map((friend) => (
                    <li key={friend._id} className="user-item">{friend.name}</li>
                  ))
                )}
              </ul>
            </div>
          )}

          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="search-input"
            />
          </div>

          <h3 className="section-header">Available Users</h3>
          <ul className="user-list">
            {users.filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((user) => (
              <li key={user._id} className="user-item">
                {user.name}
                <button className="user-button" onClick={() => handleSendRequest(user._id)}>
                  Send Friend Request
                </button>
              </li>
            ))}
          </ul>

          <h3 className="section-header">Friend Requests Sent</h3>
          <ul className="user-list">
            {userDetails?.iRequestedFriends.length === 0 ? (
              <p className="empty-message">No friend requests sent</p>
            ) : (
              userDetails.iRequestedFriends.map((friend) => (
                <li key={friend.userId} className="user-item">{friend.name}</li>
              ))
            )}
          </ul>

          <h3 className="section-header">Friend Requests Received</h3>
          <ul className="user-list">
            {userDetails?.friendsRequested.length === 0 ? (
              <p className="empty-message">No friend requests received</p>
            ) : (
              userDetails.friendsRequested.map((friend) => (
                <li key={friend.userId} className="user-item">
                  {friend.name}
                  <button
                    className="user-button accept"
                    onClick={() => handleAcceptRequest(friend.userId)}
                  >
                    Accept
                  </button>
                  <button
                    className="user-button reject"
                    onClick={() => handleRejectRequest(friend.userId)}
                  >
                    Reject
                  </button>
                </li>
              ))
            )}
          </ul>

          <h3 className="section-header">Friend Recommendations</h3>
          <ul className="user-list">
            {friendRecommendations.length === 0 ? (
              <p className="empty-message">No friend recommendations</p>
            ) : (
              friendRecommendations.map((recommendation) => (
                <li key={recommendation._id} className="user-item">
                  {recommendation.name}
                  <button
                    className="user-button"
                    onClick={() => handleSendRequest(recommendation.userId)}
                  >
                    Send Friend Request
                  </button>
                </li>
              ))
            )}
          </ul>

          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
