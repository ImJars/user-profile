import { useState } from 'react'
import { motion } from 'framer-motion'
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminPublicaciones({ publicaciones }) {
  const [editando, setEditando] = useState(null)
  const [nuevaPublicacion, setNuevaPublicacion] = useState('')

  const crearPublicacion = async (e) => {
    e.preventDefault()
    if (nuevaPublicacion.trim()) {
      await addDoc(collection(db, 'publicaciones'), {
        contenido: nuevaPublicacion,
        likes: 0,
        vistas: 0,
        fecha: new Date().toISOString(),
        comentarios: []
      })
      setNuevaPublicacion('')
    }
  }

  const eliminarPublicacion = async (id) => {
    await deleteDoc(doc(db, 'publicaciones', id))
  }

  const editarPublicacion = async (id, nuevoContenido) => {
    await updateDoc(doc(db, 'publicaciones', id), {
      contenido: nuevoContenido
    })
    setEditando(null)
  }

  const eliminarComentario = async (pubId, comentId) => {
    const publicacionRef = doc(db, 'publicaciones', pubId)
    const publicacion = publicaciones.find(p => p.id === pubId)
    const nuevosComentarios = publicacion.comentarios.filter(c => c.id !== comentId)
    await updateDoc(publicacionRef, { comentarios: nuevosComentarios })
  }

  return (
    <div className="space-y-6">
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={crearPublicacion}
        className="bg-white rounded-lg shadow-md p-4"
      >
        <h3 className="font-semibold mb-4">Crear nueva publicación</h3>
        <textarea
          value={nuevaPublicacion}
          onChange={(e) => setNuevaPublicacion(e.target.value)}
          placeholder="¿Qué quieres compartir?"
          className="w-full p-2 mb-2 border rounded resize-none"
          rows="3"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Publicar
        </motion.button>
      </motion.form>

      {publicaciones.map((pub) => (
        <motion.div
          key={pub.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <h3 className="font-semibold mb-2">{pub.usuario}</h3>
          {editando === pub.id ? (
            <form onSubmit={(e) => {
              e.preventDefault()
              editarPublicacion(pub.id, e.target.contenido.value)
            }}>
              <textarea
                name="contenido"
                defaultValue={pub.contenido}
                className="w-full p-2 mb-2 border rounded resize-none"
              />
              <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded mr-2">Guardar</button>
              <button onClick={() => setEditando(null)} className="px-3 py-1 bg-gray-500 text-white rounded">Cancelar</button>
            </form>
          ) : (
            <>
              <p className="mb-4">{pub.contenido}</p>
              <div className="flex justify-between items-center mb-2">
                <span>Likes: {pub.likes}</span>
                <span>Vistas: {pub.vistas}</span>
                <div>
                  <button onClick={() => setEditando(pub.id)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Editar</button>
                  <button onClick={() => eliminarPublicacion(pub.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </div>
            </>
          )}
          <h4 className="font-semibold mt-4 mb-2">Comentarios:</h4>
          {pub.comentarios.map((com) => (
            <div key={com.id} className="bg-gray-100 rounded p-2 mb-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{com.nombre}: </span>
                {com.contenido}
              </div>
              <button onClick={() => eliminarComentario(pub.id, com.id)} className="text-red-500">Eliminar</button>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

