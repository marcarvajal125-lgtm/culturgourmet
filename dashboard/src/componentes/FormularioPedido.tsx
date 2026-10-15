import { useState } from 'react';
import type { ItemCarrito, MetodoEntrega } from '../types/index';
import styles from './FormularioPedido.module.css';

interface FormularioPedidoProps {
  items: ItemCarrito[];
  onCerrar: () => void;
  onConfirmado: () => void;
}

const formato = (valor: number) => '$' + valor.toLocaleString('es-CO');

const datosVacios = {
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  direccion: '',
  barrio: '',
  mesa: '',
};

export const FormularioPedido = ({ items, onCerrar, onConfirmado }: FormularioPedidoProps) => {
  const [metodo, setMetodo] = useState<MetodoEntrega>('domicilio');
  const [datos, setDatos] = useState(datosVacios);
  const [error, setError] = useState('');
  const [totalConfirmado, setTotalConfirmado] = useState<number | null>(null);

  const subtotal = items.reduce((suma, item) => suma + item.plato.precio * item.cantidad, 0);
  const envio = metodo === 'domicilio' ? 5000 : 0;
  const total = subtotal + envio;

  const cambiar = (campo: keyof typeof datosVacios, valor: string) => {
    setDatos({ ...datos, [campo]: valor });
  };

  const confirmar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!datos.nombre || !datos.apellido || !datos.telefono) {
      setError('Completa tu nombre, apellido y teléfono.');
      return;
    }
    if (datos.telefono.replace(/\D/g, '').length < 7) {
      setError('El teléfono debe tener al menos 7 números.');
      return;
    }
    if (metodo === 'domicilio' && (!datos.correo.includes('@') || !datos.direccion || !datos.barrio)) {
      setError('Para domicilio necesitamos correo, dirección y barrio.');
      return;
    }
    if (metodo === 'restaurante' && !datos.mesa) {
      setError('Escribe el número de tu mesa.');
      return;
    }

    setError('');
    setTotalConfirmado(total);
    onConfirmado();
  };

  if (totalConfirmado !== null) {
    return (
      <div className={styles.fondo} onClick={onCerrar}>
        <div className={`${styles.caja} ${styles.exito}`} onClick={(e) => e.stopPropagation()}>
          <h2>¡Pedido confirmado!</h2>
          <p>
            Gracias, {datos.nombre}. Total pagado: <strong>{formato(totalConfirmado)}</strong>.
          </p>
          <p>
            {metodo === 'domicilio'
              ? `Tu pedido llegará a ${datos.direccion}, barrio ${datos.barrio}.`
              : `Te llevaremos tu pedido a la mesa ${datos.mesa}.`}
          </p>
          <button className={styles.confirmar} onClick={onCerrar}>Volver al menú</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <form className={styles.caja} onClick={(e) => e.stopPropagation()} onSubmit={confirmar}>
        <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">✕</button>
        <h2>Realizar pedido</h2>

        <div className={styles.metodos}>
          <button
            type="button"
            className={`${styles.metodo} ${metodo === 'domicilio' ? styles.metodoActivo : ''}`}
            onClick={() => setMetodo('domicilio')}
          >
            Domicilio
          </button>
          <button
            type="button"
            className={`${styles.metodo} ${metodo === 'restaurante' ? styles.metodoActivo : ''}`}
            onClick={() => setMetodo('restaurante')}
          >
            En el restaurante
          </button>
        </div>

        <div className={styles.campos}>
          <div className={styles.campo}>
            <label>Nombre</label>
            <input value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
          </div>
          <div className={styles.campo}>
            <label>Apellido</label>
            <input value={datos.apellido} onChange={(e) => cambiar('apellido', e.target.value)} />
          </div>
          <div className={`${styles.campo} ${styles.completo}`}>
            <label>Teléfono</label>
            <input type="tel" value={datos.telefono} onChange={(e) => cambiar('telefono', e.target.value)} />
          </div>

          {metodo === 'domicilio' ? (
            <>
              <div className={`${styles.campo} ${styles.completo}`}>
                <label>Correo</label>
                <input type="email" value={datos.correo} onChange={(e) => cambiar('correo', e.target.value)} />
              </div>
              <div className={styles.campo}>
                <label>Dirección</label>
                <input value={datos.direccion} onChange={(e) => cambiar('direccion', e.target.value)} />
              </div>
              <div className={styles.campo}>
                <label>Barrio</label>
                <input value={datos.barrio} onChange={(e) => cambiar('barrio', e.target.value)} />
              </div>
            </>
          ) : (
            <div className={`${styles.campo} ${styles.completo}`}>
              <label>Número de mesa</label>
              <input type="number" min="1" value={datos.mesa} onChange={(e) => cambiar('mesa', e.target.value)} />
            </div>
          )}
        </div>

        <div className={styles.resumen}>
          <div className={styles.fila}><span>Subtotal</span><span>{formato(subtotal)}</span></div>
          <div className={styles.fila}><span>Envío</span><span>{formato(envio)}</span></div>
          <div className={`${styles.fila} ${styles.total}`}><span>Total</span><span>{formato(total)}</span></div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.privacidad}>
          Tus datos se usan únicamente para gestionar este pedido.
        </p>

        <button type="submit" className={styles.confirmar}>Confirmar pedido</button>
      </form>
    </div>
  );
};