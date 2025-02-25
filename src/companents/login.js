import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react';
import './login.css';  

const Login = () => {
  const [personelUserName, setPersonelUserName] = useState(""); 
  const [personelPassword, setPersonelPassword] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        personelUserName,
        personelPassword,
      }

      const response = await axios.post("https://workfollowapi-production.up.railway.app/api/personel/login", loginData);
      if (response.status === 200) {
        console.log("Başarılı", response);
        setIsLoggedIn(true);
        navigate("/dashboard")
        
      }
    } catch (err) {
      console.log("Başarısız", err);
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="login-container">
      {}
      <img 
        src="/atilgan-logo2.png" 
        alt="Atilgan Logo" 
      />
      <div className="login-box">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={personelUserName}
            onChange={(e) => setPersonelUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={personelPassword}
            onChange={(e) => setPersonelPassword(e.target.value)}
          />
          <button type="submit">Giriş Yap</button>
        </form>
        {isLoggedIn && <h3>Giriş Başarılı!</h3>}
        {isLoggedIn !== null && !isLoggedIn && <h3 className="error">Giriş Başarısız! Lütfen tekrar deneyin.</h3>}
      </div>
    </div>
  );
};

export default Login;
