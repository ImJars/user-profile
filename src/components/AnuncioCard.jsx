import React from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaBook, FaGift, FaBullhorn, FaStar, FaRocket, FaLightbulb, FaDollarSign, FaCode, FaChartLine, FaPuzzlePiece, FaCamera } from 'react-icons/fa';

const AnuncioCard = ({ anuncio }) => {
  const getIcon = (iconName) => {
    const icons = {
      'mdi:sale': FaTag,
      'mdi:book-open-page-variant': FaBook,
      'mdi:gift': FaGift,
      'mdi:bullhorn': FaBullhorn,
      'mdi:star': FaStar,
      'mdi:rocket-launch': FaRocket,
      'mdi:lightbulb': FaLightbulb,
      'mdi:currency-usd': FaDollarSign,
      'mdi:code-braces': FaCode,
      'mdi:chart-line': FaChartLine,
      'mdi:puzzle': FaPuzzlePiece,
      'mdi:camera': FaCamera
    };
    const IconComponent = icons[iconName] || FaTag;
    return <IconComponent size={24} className="mr-2" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-md p-4 text-white mb-4"
    >
      <div className="flex items-center mb-2">
        {getIcon(anuncio.icono)}
        <h3 className="font-bold text-xl">{anuncio.titulo}</h3>
      </div>
      <p className="mb-4">{anuncio.contenido}</p>
    </motion.div>
  );
};

export default AnuncioCard;

