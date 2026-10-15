import type { MetricaProyecto } from '../types/index';
import styles from './TarjetaItem.module.css';

export const TarjetaItem = ({ titulo, valor, estado }: MetricaProyecto) => {
  return (
    <div className={styles.cardContainer}>
      <span className={styles.cardTitle}>{titulo}</span>
      <h3 className={styles.cardValue}>{valor}</h3>
      <span className={styles.cardBadge}>{estado}</span>
    </div>
  );
};