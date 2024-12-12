import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { addDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db, storage } from '../firebase';

export default function AdminFotos({ photos }) {
  const fileInputRef = useRef(null);

  const agregarFoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `photos/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        name: file.name,
        createdAt: new Date().toISOString()
      });
    }
  };

  const eliminarFoto = async (photo) => {
    await deleteDoc(doc(db, 'photos', photo.id));
    const storageRef = ref(storage, photo.url);
    await deleteObject(storageRef);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Subir Foto
        </motion.button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={agregarFoto}
        accept="image/*"
        className="hidden"
      />

      <AnimatePresence>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <img
                src={photo.url}
                alt={`Foto ${photo.id}`}
                className="rounded-lg shadow-md object-cover w-full h-full"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => eliminarFoto(photo)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash size={20} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

