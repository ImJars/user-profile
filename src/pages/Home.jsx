import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a MiApp</h1>
      <div className="flex space-x-4">
        <Link to="/perfil" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Ver Perfil
        </Link>
        <Link to="/admin" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Ir al Admin
        </Link>
      </div>
    </div>
  );
};

export default Home;

