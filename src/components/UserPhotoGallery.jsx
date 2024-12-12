import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UserPhotoGallery = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos || photos.length === 0) {
    return <div>No hay fotos disponibles.</div>;
  }

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Mis Fotos</h2>
      <div className="relative w-full max-w-xs mx-auto">
        <motion.img
          key={currentIndex}
          src={photos[currentIndex].url}
          alt={`Foto ${currentIndex + 1}`}
          className="w-full h-64 object-cover rounded-lg shadow-md cursor-pointer"
          onClick={() => setSelectedPhoto(photos[currentIndex])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <button
          onClick={prevPhoto}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextPhoto}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="max-w-3xl max-h-full p-4">
              <img
                src={selectedPhoto.url}
                alt="Foto seleccionada"
                className="max-h-[80vh] w-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserPhotoGallery;

