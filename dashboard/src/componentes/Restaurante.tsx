import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Plato, ItemCarrito } from '../types/index';
import { platos as platosLocales, culturas } from '../data/platos';
import { cargarMenu, buscarEnApi } from '../services/api';
import { PlatoCard } from './PlatoCard';
import { Navbar } from './Navbar';
import { Carrito } from './Carrito';
import { Filtros } from './Filtros';
import { FichaPlato } from './FichaPlato';
import { FormularioPedido } from './FormularioPedido';
import styles from '../App.module.css';

const CLAVE_CARRITO = 'culturgourmet-carrito';

const cargarCarrito = (): ItemCarrito[] => {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
};

interface RestauranteProps {
  // Lo que va debajo de los platos. Recibe la función para agregar al carrito.
  children?: (agregar: (plato: Plato) => void) => ReactNode;
}

export const Restaurante = ({ children }: RestauranteProps) => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>(cargarCarrito);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [platoSeleccionado, setPlatoSeleccionado] = useState<Plato | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [cultura, setCultura] = useState('Todas');
  const [sinPicante, setSinPicante] = useState(false);
  const [aviso, setAviso] = useState('');

  const [platosApi, setPlatosApi] = useState<Plato[]>([]);
  const [resultadosApi, setResultadosApi] = useState<Plato[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');

  useEffect(() => {
    cargarMenu()
      .then((platos) => setPlatosApi(platos))
      .catch(() => setErrorApi('No se pudo cargar el menú internacional. Revisa tu conexión.'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    const texto = busqueda.trim();
    if (texto.length < 3) return;

    const espera = setTimeout(() => {
      buscarEnApi(texto)
        .then(setResultadosApi)
        .catch(() => setResultadosApi([]));
    }, 500);

    return () => clearTimeout(espera);
  }, [busqueda]);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch {
      // Si el navegador no deja guardar, la página sigue funcionando
    }
  }, [carrito]);

  const resultadosVisibles = busqueda.trim().length >= 3 ? resultadosApi : [];
  const todosLosPlatos = [...platosLocales, ...platosApi, ...resultadosVisibles].filter(
    (plato, indice, lista) => lista.findIndex((p) => p.id === plato.id) === indice
  );

  const cantidadTotal = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  const texto = busqueda.toLowerCase();
  const platosFiltrados = todosLosPlatos.filter((plato) => {
    const coincideCultura = cultura === 'Todas' || plato.pais === cultura;
    const coincidePicante = !sinPicante || !plato.etiquetas.includes('Picante');
    const coincideBusqueda =
      plato.nombre.toLowerCase().includes(texto) ||
      plato.descripcion.toLowerCase().includes(texto) ||
      plato.ingredientes.some((ing) => ing.toLowerCase().includes(texto));
    return coincideCultura && coincidePicante && coincideBusqueda;
  });

  const mostrarAviso = (mensaje: string) => {
    setAviso(mensaje);
    setTimeout(() => setAviso(''), 2000);
  };

  const agregarAlCarrito = (plato: Plato, cantidad: number = 1) => {
    setCarrito((actual) => {
      const existe = actual.find((item) => item.plato.id === plato.id);
      if (existe) {
        return actual.map((item) =>
          item.plato.id === plato.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...actual, { plato, cantidad }];
    });
    mostrarAviso(plato.nombre + ' agregado al carrito');
  };

  const cambiarCantidad = (id: number, cambio: number) => {
    setCarrito((actual) =>
      actual
        .map((item) => (item.plato.id === id ? { ...item, cantidad: item.cantidad + cambio } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminar = (id: number) => {
    setCarrito((actual) => actual.filter((item) => item.plato.id !== id));
  };

  const irAlPedido = () => {
    setCarritoAbierto(false);
    setFormularioAbierto(true);
  };

  const mensajeVacio = () => {
    if (cultura !== 'Todas' && !todosLosPlatos.some((p) => p.pais === cultura)) {
      return 'Pronto agregaremos platos de ' + cultura + '.';
    }
    return 'No encontramos platos con esos filtros.';
  };

  return (
    <>
      <Navbar cantidad={cantidadTotal} onAbrirCarrito={() => setCarritoAbierto(true)} />

      <main className={styles.contenedor}>
        <section className={styles.hero}>
          <h1>Culturgourmet</h1>
          <p>Más que comida, una historia</p>
        </section>

        <section className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>Nuestros platos</h2>

          <input
            className={styles.buscador}
            type="text"
            placeholder="Buscar plato o ingrediente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <Filtros
            culturas={culturas}
            culturaActiva={cultura}
            onCambiarCultura={setCultura}
            sinPicante={sinPicante}
            onCambiarSinPicante={setSinPicante}
          />

          {cargando && <p className={styles.sinResultados}>Cargando menú internacional...</p>}
          {errorApi && <p className={styles.sinResultados}>{errorApi}</p>}

          {platosFiltrados.length === 0 ? (
            !cargando && <p className={styles.sinResultados}>{mensajeVacio()}</p>
          ) : (
            <div className={styles.gridPlatos}>
              {platosFiltrados.map((plato) => (
                <PlatoCard
                  key={plato.id}
                  plato={plato}
                  onAgregar={(p) => agregarAlCarrito(p)}
                  onVer={setPlatoSeleccionado}
                />
              ))}
            </div>
          )}
        </section>

        {children?.((p) => agregarAlCarrito(p))}
      </main>

      <footer className={styles.footer}>
        © 2026 Culturgourmet · Más que comida, una historia
      </footer>

      {carritoAbierto && (
        <Carrito
          items={carrito}
          onCerrar={() => setCarritoAbierto(false)}
          onCambiarCantidad={cambiarCantidad}
          onEliminar={eliminar}
          onPedir={irAlPedido}
        />
      )}

      {platoSeleccionado && (
        <FichaPlato
          plato={platoSeleccionado}
          onCerrar={() => setPlatoSeleccionado(null)}
          onAgregar={agregarAlCarrito}
        />
      )}

      {formularioAbierto && (
        <FormularioPedido
          items={carrito}
          onCerrar={() => setFormularioAbierto(false)}
          onConfirmado={() => setCarrito([])}
        />
      )}

      {aviso && <div className={styles.aviso}>{aviso}</div>}
    </>
  );
};