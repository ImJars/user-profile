import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import PublicacionCard from '../components/PublicacionesCard';
import AnuncioCard from '../components/AnuncioCard';
import UserPhotoGallery from '../components/UserPhotoGallery';
import UserProfile from '../components/UserProfile';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        fetchData(authUser.uid);
      } else {
        setUser(null);
        setIsLoading(false);
        setError("No hay usuario autenticado. Por favor, inicia sesión.");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchData = (userId) => {
    // Fetch user data
    const unsubscribeUser = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        setUser({ id: doc.id, ...doc.data() });
        setError(null);
      } else {
        console.log("No se encontró el documento del usuario");
        setUser(null);
        setError("No se encontró el perfil de usuario.");
      }
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching user data:", err);
      setError("Error al cargar el perfil de usuario.");
      setIsLoading(false);
    });

    // Fetch publicaciones
    const unsubscribePublicaciones = onSnapshot(
      query(collection(db, "publicaciones"), orderBy("fecha", "desc")),
      (snapshot) => {
        setPublicaciones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => {
        console.error("Error fetching publicaciones:", err);
      }
    );

    // Fetch anuncios
    const unsubscribeAnuncios = onSnapshot(collection(db, "anuncios"), (snapshot) => {
      setAnuncios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Error fetching anuncios:", err);
    });

    // Fetch photos
    const unsubscribePhotos = onSnapshot(collection(db, "photos"), (snapshot) => {
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Error fetching photos:", err);
    });

    return () => {
      unsubscribeUser();
      unsubscribePublicaciones();
      unsubscribeAnuncios();
      unsubscribePhotos();
    };
  };

  if (isLoading) return <div>Cargando...</div>;

  if (error) return <div>{error}</div>;

  if (!user) return <div>No se encontró el perfil de usuario.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto mt-20 p-6"
    >
      <UserProfile user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {publicaciones.map((publicacion) => (
            <PublicacionCard 
              key={publicacion.id} 
              publicacion={publicacion}
            />
          ))}
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Anuncios</h2>
          {anuncios.map((anuncio) => (
            <AnuncioCard key={anuncio.id} anuncio={anuncio} />
          ))}
          <UserPhotoGallery photos={photos} />
        </div>
      </div>
    </motion.div>
  );
}

