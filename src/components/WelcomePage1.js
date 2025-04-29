import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage1() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>AI Sports Recommender</h1>
        <div>
          <button
            style={{ ...styles.button, backgroundColor: '#3b82f6', color: 'white', marginRight: '10px' }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
          <button
            style={{ ...styles.button, border: '2px solid #3b82f6', color: '#3b82f6', backgroundColor: 'white' }}
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <h2 style={styles.title}>Discover the Best Sports Events Tailored for You</h2>
        <p style={styles.description}>
          Our AI-powered recommendation system helps you find sports events you’ll love — whether you're a player,
          fan, or organizer.
        </p>
        
      </main>
    </div>
  );
}

const styles = {
  header: {
    padding: '20px 40px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
  },
  main: {
    textAlign: 'center',
    marginTop: '100px',
    padding: '0 20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
  },
  description: {
    fontSize: '18px',
    color: '#4b5563',
    maxWidth: '600px',
    margin: '0 auto 40px auto',
  },
};

export default WelcomePage1;
