import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase'

export default function PublicacionCard({ publicacion }) {
  const [mostrarComentarios, setMostrarComentarios] = useState(false)
  const [nuevoComentario, setNuevoComentario] = useState({ nombre: '', contenido: '' })

  const handleSubmitComentario = async (e) => {
    e.preventDefault()
    if (nuevoComentario.nombre.trim() && nuevoComentario.contenido.trim()) {
      const comentarioRef = doc(db, 'publicaciones', publicacion.id)
      await updateDoc(comentarioRef, {
        comentarios: arrayUnion({
          id: Date.now(),
          ...nuevoComentario,
          fecha: new Date().toISOString()
        })
      })
      setNuevoComentario({ nombre: '', contenido: '' })
    }
  }

  const handleLike = async () => {
    const publicacionRef = doc(db, 'publicaciones', publicacion.id)
    await updateDoc(publicacionRef, {
      likes: publicacion.likes + 1
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4 mb-4"
    >
      <div className="flex items-center mb-3">
        <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${publicacion.usuario}`} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="font-semibold">{publicacion.usuario}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{new Date(publicacion.fecha).toLocaleString()}</p>
        </div>
      </div>
      <p className="mb-4 text-sm sm:text-base">{publicacion.contenido}</p>
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="flex items-center text-gray-500"
        >
          <Heart className="mr-1" size={20} />
          <span className="text-sm">{publicacion.likes}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
          className="flex items-center text-gray-500"
        >
          <MessageCircle className="mr-1" size={20} />
          <span className="text-sm">{publicacion.comentarios.length}</span>
        </motion.button>
        <div className="flex items-center text-gray-500">
          <Eye className="mr-1" size={20} />
          <span className="text-sm">{publicacion.vistas}</span>
        </div>
      </div>
      <AnimatePresence>
        {mostrarComentarios && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {publicacion.comentarios.map((comentario) => (
              <div key={comentario.id} className="bg-gray-100 rounded p-2">
                <p className="font-semibold text-sm">{comentario.nombre}</p>
                <p className="text-sm">{comentario.contenido}</p>
              </div>
            ))}
            <form onSubmit={handleSubmitComentario} className="mt-2 space-y-2">
              <input
                type="text"
                value={nuevoComentario.nombre}
                onChange={(e) => setNuevoComentario({...nuevoComentario, nombre: e.target.value})}
                placeholder="Tu nombre"
                className="w-full p-2 border rounded text-sm"
              />
              <textarea
                value={nuevoComentario.contenido}
                onChange={(e) => setNuevoComentario({...nuevoComentario, contenido: e.target.value})}
                placeholder="Escribe un comentario..."
                className="w-full p-2 border rounded text-sm"
                rows="2"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Comentar
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

