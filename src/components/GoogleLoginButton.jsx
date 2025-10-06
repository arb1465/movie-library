// src/components/GoogleLoginButton.jsx
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // Corrected import

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("Missing VITE_GOOGLE_CLIENT_ID environment variable. Google login will not work.");
}

function GoogleLoginButton({ onLoginSuccess, onLogout }) {
  const [user, setUser] = useState(null); // To store logged-in user data

  useEffect(() => {
    // Check for stored user session on component mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Google Login Success:', decoded);
    const userInfo = {
      id: decoded.sub, // 'sub' is the unique Google user ID
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    };
    setUser(userInfo);
    localStorage.setItem('currentUser', JSON.stringify(userInfo)); // Persist user info
    onLoginSuccess(userInfo); // Notify parent component
  };

  const handleLoginError = () => {
    console.error('Google Login Failed');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    onLogout(); // Notify parent component
    console.log('User logged out.');
  };

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
        Google Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your .env file.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        {user ? (
          <div className="google-user-info">
            {user.picture ? (
                // Option 1: User has a profile picture. Display it.
                <img
                    src={user.picture}
                    alt={user.name}
                    className="user-avatar" // Use the same class as before for general avatar styling
                    // Optionally, add onError here if you want a fallback *even when a picture is provided*
                    // onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.user-initials').style.display = 'flex'; }}
                />
            ) : (
                // Option 2: No profile picture. Display the first initial.
                <div
                    className="user-avatar user-initials" // Use a class for specific styling
                    style={{
                        display: 'flex', // Always visible if no picture
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#007bff', // Example: a consistent background color
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                        borderRadius: '50%',
                        width: '40px', // Consistent size
                        height: '40px', // Consistent size
                        marginRight: '10px',
                        textTransform: 'uppercase'
                    }}
                >
                    {user.name ? user.name.charAt(0) : ''}
                </div>
            )}

            <span className="user-name">Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            useOneTap
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;