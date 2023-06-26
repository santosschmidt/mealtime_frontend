import React from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext, IAuthContext} from "react-oauth2-code-pkce";

import Home from "./components/Home";

import './App.scss';


function App() {
  const {token} = useContext<IAuthContext>(AuthContext)
  const navigate = useNavigate();
  if (!token) {
      navigate(0)
  }

  return (
    <Routes>
        <Route path="/callback" element={<Home token={token}/>}/>
        <Route path="/home" element={<Home token={token}/>}/>
        <Route path="/" element={token ? <Home token={token}/> : <>Redirecting</>}/>
        <Route path="*" element={<Home token={token}/>}/>
    </Routes>
  );
}

export default App;
