import './header.css';
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const activeStyle = {
  color: 'black',
};

export default function Header() {
  return (
    <div className="header">
      <header className="navbar">
        <div className="nav-left">
          <h3>분산 투자 보조 프로그램</h3>
        </div>
        <div className="nav-links">
          <NavLink style={({ isActive }) => (isActive ? activeStyle : {})}  to="/" exact="true">조건설정</NavLink>
          <NavLink style={({ isActive }) => (isActive ? activeStyle : {})}  to="/invest" exact="true">종목설정</NavLink>
        </div>
      </header>
    </div>
  );
}
