import type { Plato } from '../types/index';
import styles from './PlatoCard.module.css';

interface PlatoCardProps {
  plato: Plato;
  onAgregar: (plato: Plato) => void;
  onVer: (plato: Plato) => void;
}

export const PlatoCard = ({ plato, onAgregar, onVer }: PlatoCardProps) => {
  return (
    <article className={styles.plato}>
      <div className={styles.imagen}>
        <span className={styles.categoria}>{plato.pais}</span>
        <img src={plato.imagen} alt={plato.nombre} loading="lazy" />
      </div>

      <div className={styles.contenido}>
        <h3>{plato.nombre}</h3>
        <p>{plato.descripcion}</p>

        <div className={styles.etiquetas}>
          {plato.etiquetas.map((etiqueta) => (
            <span
              key={etiqueta}
              className={`${styles.etiqueta} ${etiqueta === 'Picante' ? styles.picante : ''}`}
            >
              {etiqueta}
            </span>
          ))}
        </div>

        <span className={styles.precio}>${plato.precio.toLocaleString('es-CO')}</span>

        <div className={styles.botones}>
          <button className={`${styles.boton} ${styles.secundario}`} onClick={() => onVer(plato)}>
            Ver plato
          </button>
          <button className={styles.boton} onClick={() => onAgregar(plato)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
};