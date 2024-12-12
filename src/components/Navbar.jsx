import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white bg-opacity-70 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              MiApp
            </Link>
          </div>
          <div className="flex space-x-4">
            <NavLink to="/perfil" currentPath={location.pathname}>
              Perfil de Usuario
            </NavLink>
            <NavLink to="/admin" currentPath={location.pathname}>
              Administrador
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, currentPath }) => {
  const isActive = currentPath === to;

  return (
    <Link to={to} className="relative">
      <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          layoutId="underline"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default Navbar;

