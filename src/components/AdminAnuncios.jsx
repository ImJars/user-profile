import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTag, FaBook, FaGift, FaBullhorn, FaStar, FaRocket, FaLightbulb, FaDollarSign, FaCode, FaChartLine, FaPuzzlePiece, FaCamera } from 'react-icons/fa';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore'
import { db } from '../firebase'

const iconOptions = [
  { name: 'mdi:sale', component: FaTag },
  { name: 'mdi:book-open-page-variant', component: FaBook },
  { name: 'mdi:gift', component: FaGift },
  { name: 'mdi:bullhorn', component: FaBullhorn },
  { name: 'mdi:star', component: FaStar },
  { name: 'mdi:rocket-launch', component: FaRocket },
  { name: 'mdi:lightbulb', component: FaLightbulb },
  { name: 'mdi:currency-usd', component: FaDollarSign },
  { name: 'mdi:code-braces', component: FaCode },
  { name: 'mdi:chart-line', component: FaChartLine },
  { name: 'mdi:puzzle', component: FaPuzzlePiece },
  { name: 'mdi:camera', component: FaCamera }
];

export default function AdminAnuncios({ anuncios }) {
  const [editando, setEditando] = useState(null)
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ titulo: '', contenido: '', icono: 'mdi:sale' })

  const agregarAnuncio = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, 'anuncios'), nuevoAnuncio)
    setNuevoAnuncio({ titulo: '', contenido: '', icono: 'mdi:sale' })
  }

  const eliminarAnuncio = async (id) => {
    await deleteDoc(doc(db, 'anuncios', id))
  }

  const editarAnuncio = async (id, nuevosDatos) => {
    await updateDoc(doc(db, 'anuncios', id), nuevosDatos)
    setEditando(null)
  }

  return (
    <div className="space-y-6">
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={agregarAnuncio}
        className="bg-white rounded-lg shadow-md p-4"
      >
        <h3 className="font-semibold mb-4">Agregar nuevo anuncio</h3>
        <input
          type="text"
          placeholder="Título"
          value={nuevoAnuncio.titulo}
          onChange={(e) => setNuevoAnuncio({ ...nuevoAnuncio, titulo: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Contenido"
          value={nuevoAnuncio.contenido}
          onChange={(e) => setNuevoAnuncio({ ...nuevoAnuncio, contenido: e.target.value })}
          className="w-full p-2 mb-2 border rounded resize-none"
        />
        <div className="mb-2">
          <label className="block mb-1">Seleccionar icono:</label>
          <div className="grid grid-cols-4 gap-2">
            {iconOptions.map((icon) => (
              <button
                key={icon.name}
                type="button"
                onClick={() => setNuevoAnuncio({ ...nuevoAnuncio, icono: icon.name })}
                className={`p-2 border rounded ${nuevoAnuncio.icono === icon.name ? 'bg-blue-100 border-blue-500' : ''}`}
              >
                <icon.component size={24} />
              </button>
            ))}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Agregar Anuncio
        </motion.button>
      </motion.form>

      {anuncios.map((anuncio) => (
        <motion.div
          key={anuncio.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          {editando && editando.id === anuncio.id ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              editarAnuncio(anuncio.id, editando);
            }}>
              <input
                name="titulo"
                value={editando.titulo}
                onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <textarea
                name="contenido"
                value={editando.contenido}
                onChange={(e) => setEditando({ ...editando, contenido: e.target.value })}
                className="w-full p-2 mb-2 border rounded resize-none"
              />
              <div className="mb-2">
                <label className="block mb-1">Seleccionar icono:</label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setEditando({ ...editando, icono: icon.name })}
                      className={`p-2 border rounded ${editando.icono === icon.name ? 'bg-blue-100 border-blue-500' : ''}`}
                    >
                      <icon.component size={24} />
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded mr-2">Guardar</button>
              <button type="button" onClick={() => setEditando(null)} className="px-3 py-1 bg-gray-500 text-white rounded">Cancelar</button>
            </form>
          ) : (
            <>
              <div className="flex items-center mb-2">
                <FaTag size={24} className="mr-2"/>
                <h3 className="font-semibold">{anuncio.titulo}</h3>
              </div>
              <p className="mb-4">{anuncio.contenido}</p>
              <div className="flex justify-end">
                <button onClick={() => setEditando({ ...anuncio })} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Editar</button>
                <button onClick={() => eliminarAnuncio(anuncio.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
              </div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  )
}

