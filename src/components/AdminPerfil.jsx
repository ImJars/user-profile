import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const AdminPerfil = ({ user }) => {
  const [editedUser, setEditedUser] = useState(user || {});
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  if (!user) {
    return <div>No se ha cargado la información del usuario.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newSocialLinks = [...(editedUser.socialLinks || [])];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setEditedUser({ ...editedUser, socialLinks: newSocialLinks });
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `${type}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setEditedUser({ ...editedUser, [`${type}Url`]: downloadURL });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.id) {
      console.error("User ID is undefined");
      return;
    }
    const userRef = doc(db, 'users', user.id);
    try {
      await updateDoc(userRef, editedUser);
      alert("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al actualizar el perfil");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedUser.name || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={editedUser.description || ''}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Avatar</label>
          <div className="mt-1 flex items-center space-x-4">
            <img
              src={editedUser.avatarUrl || '/placeholder.svg'}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => avatarInputRef.current.click()}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Cambiar Avatar
            </motion.button>
            <input
              type="file"
              ref={avatarInputRef}
              onChange={(e) => handleImageUpload(e, 'avatar')}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Banner</label>
          <div className="mt-1 flex items-center space-x-4">
            <img
              src={editedUser.bannerUrl || '/placeholder.svg'}
              alt="Banner"
              className="w-32 h-16 object-cover rounded"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => bannerInputRef.current.click()}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Cambiar Banner
            </motion.button>
            <input
              type="file"
              ref={bannerInputRef}
              onChange={(e) => handleImageUpload(e, 'banner')}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Redes Sociales</label>
          {(editedUser.socialLinks || []).map((link, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={link.name || ''}
                onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                placeholder="Nombre"
                className="w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                type="text"
                value={link.url || ''}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                placeholder="URL"
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                type="text"
                value={link.icon || ''}
                onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                placeholder="Nombre del icono (ej: FaTwitter)"
                className="w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Guardar Cambios
      </motion.button>
    </motion.form>
  );
};

export default AdminPerfil;

