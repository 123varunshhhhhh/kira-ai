import React, { useState, useContext } from 'react';
import { dataContext } from './UserContext.jsx';
import { IoClose } from "react-icons/io5";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";

function AuthModal() {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    authMode, 
    setAuthMode, 
    login, 
    signup 
  } = useContext(dataContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        const result = login(formData.email, formData.password);
        if (!result.success) {
          setError(result.error);
        }
      } else {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        
        const result = signup(formData.name, formData.email, formData.password);
        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    
    setIsLoading(false);
  };

  const switchMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
  };

  if (!showAuthModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '16px',
        padding: '32px',
        width: '90%',
        maxWidth: '400px',
        border: '2px solid #333',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={() => setShowAuthModal(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#666',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#333'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <IoClose />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            color: '#fff', 
            margin: '0 0 8px 0', 
            fontSize: '28px',
            fontWeight: '600'
          }}>
            {authMode === 'login' ? 'Welcome Back' : 'Join Kira AI'}
          </h2>
          <p style={{ 
            color: '#888', 
            margin: 0, 
            fontSize: '14px' 
          }}>
            {authMode === 'login' 
              ? 'Sign in to access your personal AI assistant' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {authMode === 'signup' && (
            <div style={{ position: 'relative' }}>
              <MdPerson style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '20px'
              }} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: '#222',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7fd7ff'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <MdEmail style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '20px'
            }} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                background: '#222',
                border: '2px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7fd7ff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MdLock style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '20px'
            }} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                background: '#222',
                border: '2px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7fd7ff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          {authMode === 'signup' && (
            <div style={{ position: 'relative' }}>
              <MdLock style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '20px'
              }} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: '#222',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7fd7ff'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              background: '#ff4444',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: '#7fd7ff',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.background = '#5bc0de')}
            onMouseLeave={(e) => !isLoading && (e.target.style.background = '#7fd7ff')}
          >
            {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Switch mode */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px', 
          paddingTop: '24px', 
          borderTop: '1px solid #333' 
        }}>
          <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>
            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={switchMode}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7fd7ff',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            {authMode === 'login' ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal; 