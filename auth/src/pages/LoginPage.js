import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Popup from 'react-oauth-popup';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, { email, password });
      login(data);
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleSuccess = async (token) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/google/success`, { headers: { Authorization: `Bearer ${token}` } });
      login(data);
      navigate('/profile');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGitHubSuccess = async (token) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/github/success`, { headers: { Authorization: `Bearer ${token}` } });
      login(data);
      navigate('/profile');
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };


  return (
    <form onSubmit={submitHandler} className="container mt-5">
      <h2 className="text-center text-primary">Login</h2>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br></br>
      <button type="submit" className="btn btn-primary d-block mx-auto">Login</button>
      <br />
      <Popup
        url={`${process.env.REACT_APP_API_URL}/auth/google`}
        onCode={handleGoogleSuccess}
        onError={(error) => console.error('Google login error:', error)}
      >
        <button className="btn btn-danger d-block mx-auto">Login with Google</button>
      </Popup>
      <Popup
        url={`${process.env.REACT_APP_API_URL}/auth/github`}
        onCode={handleGitHubSuccess}
        onError={(error) => console.error('GitHub login error:', error)}
      >
        <button className="btn btn-dark d-block mx-auto">Login with GitHub</button>
      </Popup>
    </form>
  );
};

export default LoginPage;
