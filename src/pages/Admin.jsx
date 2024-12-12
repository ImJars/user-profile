import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import AdminPublicaciones from '../components/AdminPublicaciones';
import AdminAnuncios from '../components/AdminAnuncios';
import AdminFotos from '../components/AdminFotos';
import AdminPerfil from '../components/AdminPerfil';
import LoginForm from '../components/LoginForm';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        fetchData(user.uid);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchData = (userId) => {
    // Fetch user data
    const unsubscribeUser = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        setUser(prevUser => ({ ...prevUser, ...doc.data() }));
      }
    });

    // Fetch publicaciones
    const unsubscribePublicaciones = onSnapshot(
      query(collection(db, "publicaciones"), orderBy("fecha", "desc")),
      (snapshot) => {
        setPublicaciones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    // Fetch anuncios
    const unsubscribeAnuncios = onSnapshot(collection(db, "anuncios"), (snapshot) => {
      setAnuncios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch photos
    const unsubscribePhotos = onSnapshot(collection(db, "photos"), (snapshot) => {
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeUser();
      unsubscribePublicaciones();
      unsubscribeAnuncios();
      unsubscribePhotos();
    };
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="flex mb-6 space-x-2 overflow-x-auto">
        <TabButton active={activeTab === 'publicaciones'} onClick={() => setActiveTab('publicaciones')}>
          Publicaciones
        </TabButton>
        <TabButton active={activeTab === 'anuncios'} onClick={() => setActiveTab('anuncios')}>
          Anuncios
        </TabButton>
        <TabButton active={activeTab === 'fotos'} onClick={() => setActiveTab('fotos')}>
          Fotos
        </TabButton>
        <TabButton active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')}>
          Perfil
        </TabButton>
      </div>
      {activeTab === 'publicaciones' && <AdminPublicaciones publicaciones={publicaciones} />}
      {activeTab === 'anuncios' && <AdminAnuncios anuncios={anuncios} />}
      {activeTab === 'fotos' && <AdminFotos photos={photos} />}
      {activeTab === 'perfil' && user && <AdminPerfil user={user} />}
    </motion.div>
  );
}

const TabButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
      active ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
    }`}
  >
    {children}
  </button>
);
