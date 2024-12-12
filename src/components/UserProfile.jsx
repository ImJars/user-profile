import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-blue-500 to-purple-500">
        <img
          src={user.bannerUrl}
          alt="Banner de perfil"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative px-4 sm:px-6 pb-6">
        <div className="flex justify-center">
          <img
            src={user.avatarUrl}
            alt="Foto de perfil"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white -mt-12 sm:-mt-16"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4">{user.name}</h1>
        <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">{user.description}</p>
        <div className="flex justify-center space-x-4 mt-4">
          {user.socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 hover:text-gray-800"
            >
              {link.name === 'Twitter' && <FaTwitter size={24} />}
              {link.name === 'LinkedIn' && <FaLinkedin size={24} />}
              {link.name === 'GitHub' && <FaGithub size={24} />}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;

