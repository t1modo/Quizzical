import React from 'react';
import logo from '../assets/quizzical.png';
import '../Styling/Logo.css';

const Logo = ({ isSubmitted }) => {
  return (
    <img 
      src={logo} 
      alt="App Logo" 
      className={`AppLogo ${isSubmitted ? 'smallLogo' : 'largeLogo'}`} 
    />
  );
};

export default Logo;
