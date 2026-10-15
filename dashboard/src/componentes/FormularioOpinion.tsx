import { useState } from 'react';
import type { Opinion } from '../types/index';

interface FormularioProps {
  onAgregarOpinion: (nuevaOpinion: Opinion) => void;
}

export const FormularioOpinion = ({ onAgregarOpinion }: FormularioProps) => {
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !comentario.trim()) return;

    const nueva: Opinion = {
      id: Date.now(),
      nombre,
      comentario,
      calificacion,
    };

    onAgregarOpinion(nueva);
    setNombre('');
    setComentario('');
    setCalificacion(5);
  };

  const estiloCampo = {
    width: '100%',
    padding: '0.6rem',
    background: '#0D0A0C',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: '#FFF8F5',
    borderRadius: '8px',
    fontFamily: 'inherit',
  };

  const estiloEtiqueta = {
    display: 'block',
    fontSize: '0.85rem',
    color: '#BEB4B8',
    marginBottom: '0.3rem',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ background: '#151013', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(212, 175, 55, 0.3)', marginBottom: '1.5rem' }}
    >
      <h3 style={{ color: '#D4AF37', marginTop: 0 }}>Déjanos tu opinión</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={estiloEtiqueta}>Tu nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Andrés"
            style={estiloCampo}
          />
        </div>

        <div>
          <label style={estiloEtiqueta}>Calificación:</label>
          <select
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
            style={estiloCampo}
          >
            <option value={5}>★★★★★ (5)</option>
            <option value={4}>★★★★ (4)</option>
            <option value={3}>★★★ (3)</option>
            <option value={2}>★★ (2)</option>
            <option value={1}>★ (1)</option>
          </select>
        </div>
      </div>

      <label style={estiloEtiqueta}>Comentario:</label>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="¿Qué te pareció tu experiencia en Culturgourmet?"
        rows={3}
        style={{ ...estiloCampo, resize: 'vertical' }}
      />

      <button
        type="submit"
        style={{ marginTop: '1rem', background: '#7A1737', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Publicar opinión
      </button>
    </form>
  );
};