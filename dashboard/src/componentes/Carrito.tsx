import type { ItemCarrito } from '../types/index';
import styles from './Carrito.module.css';

interface CarritoProps {
  items: ItemCarrito[];
  onCerrar: () => void;
  onCambiarCantidad: (id: number, cambio: number) => void;
  onEliminar: (id: number) => void;
  onPedir: () => void;
}

const formato = (valor: number) => '$' + valor.toLocaleString('es-CO');

export const Carrito = ({ items, onCerrar, onCambiarCantidad, onEliminar, onPedir }: CarritoProps) => {
  const subtotal = items.reduce((suma, item) => suma + item.plato.precio * item.cantidad, 0);
  const envio = items.length > 0 ? 5000 : 0;
  const total = subtotal + envio;

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cabecera}>
          <h2>Mi carrito</h2>
          <button className={styles.cerrar} onClick={onCerrar}>✕</button>
        </div>

        <div className={styles.lista}>
          {items.length === 0 ? (
            <p className={styles.vacio}>Tu carrito está vacío</p>
          ) : (
            items.map((item) => (
              <div key={item.plato.id} className={styles.item}>
                <img src={item.plato.imagen} alt={item.plato.nombre} />
                <div className={styles.info}>
                  <strong>{item.plato.nombre}</strong>
                  <small>{formato(item.plato.precio)}</small>
                  <div className={styles.cantidad}>
                    <button onClick={() => onCambiarCantidad(item.plato.id, -1)}>−</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => onCambiarCantidad(item.plato.id, 1)}>+</button>
                  </div>
                </div>
                <button className={styles.eliminar} onClick={() => onEliminar(item.plato.id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        <div className={styles.resumen}>
          <div className={styles.fila}><span>Subtotal</span><span>{formato(subtotal)}</span></div>
          <div className={styles.fila}><span>Envío (solo domicilio)</span><span>{formato(envio)}</span></div>
          <div className={`${styles.fila} ${styles.total}`}><span>Total</span><span>{formato(total)}</span></div>
          <button className={styles.pedir} disabled={items.length === 0} onClick={onPedir}>
            Realizar pedido
          </button>
        </div>
      </aside>
    </div>
  );
};