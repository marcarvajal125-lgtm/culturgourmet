import type { Cultura } from '../types/index';
import styles from './Filtros.module.css';

interface FiltrosProps {
  culturas: Cultura[];
  culturaActiva: string;
  onCambiarCultura: (cultura: string) => void;
  sinPicante: boolean;
  onCambiarSinPicante: (valor: boolean) => void;
}

export const Filtros = ({ culturas, culturaActiva, onCambiarCultura, sinPicante, onCambiarSinPicante }: FiltrosProps) => {
  return (
    <div className={styles.filtros}>
      <div className={styles.culturas}>
        <button
          className={`${styles.chip} ${culturaActiva === 'Todas' ? styles.activo : ''}`}
          onClick={() => onCambiarCultura('Todas')}
        >
          Todas
        </button>

        {culturas.map((cultura) => (
          <button
            key={cultura.nombre}
            className={`${styles.chip} ${culturaActiva === cultura.nombre ? styles.activo : ''}`}
            onClick={() => onCambiarCultura(cultura.nombre)}
          >
            <img src={cultura.bandera} alt={`Bandera de ${cultura.nombre}`} />
            {cultura.nombre}
          </button>
        ))}
      </div>

      <label className={styles.dieta}>
        <input
          type="checkbox"
          checked={sinPicante}
          onChange={(e) => onCambiarSinPicante(e.target.checked)}
        />
        Mostrar solo platos sin picante
      </label>
    </div>
  );
};