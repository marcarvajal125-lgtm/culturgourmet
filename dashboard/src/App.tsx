import { useState, useEffect } from 'react';
import type { Opinion, Plato } from './types/index';
import { Restaurante } from './componentes/Restaurante';
import { FormularioOpinion } from './componentes/FormularioOpinion';
import { convertirPlatoApi } from './services/api';
import styles from './App.module.css';

export default function App() {
  // Tema 3: lista de opiniones que llegan desde el formulario
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);

  // Tema 4: plato que llega desde la API y estados de carga y error
  const [platoSorpresa, setPlatoSorpresa] = useState<Plato | null>(null);
  const [cargandoApi, setCargandoApi] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);

  // Tema 4: useEffect se ejecuta una vez al cargar el componente
  useEffect(() => {
    console.log('Componente montado: listo para peticiones HTTP.');
  }, []);

  // Tema 3: agrega la opinión que viene del formulario
  const agregarOpinion = (nueva: Opinion) => {
    setOpiniones([nueva, ...opiniones]);
  };

  // Tema 4: consumo real de la API con fetch y manejo de errores
  const consumirApiExterna = async () => {
    setCargandoApi(true);
    setErrorApi(null);

    try {
      // AQUÍ VA EL LINK DE LA API (la misma que usa nuestro menu.html)
      const respuesta = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

      if (!respuesta.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const datos = await respuesta.json();

      if (!datos.meals || datos.meals.length === 0) {
        throw new Error('La API no devolvió ningún plato');
      }

      // Transformamos el plato de la API al formato de Culturgourmet
      setPlatoSorpresa(convertirPlatoApi(datos.meals[0]));
    } catch {
      setErrorApi('No se pudo conectar con la API externa. Verifique su red.');
    } finally {
      setCargandoApi(false); // Se apaga el estado de carga pase lo que pase
    }
  };

  const estrellas = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <Restaurante>
      {(agregarAlCarrito) => (
        <>
          {/* ===== Tema 4: Plato sorpresa del chef ===== */}
          <section className={styles.seccion}>
            <h2 className={styles.tituloSeccion}>Plato sorpresa del chef</h2>
            <p style={{ color: '#BEB4B8', marginTop: 0 }}>
              ¿No sabes qué pedir? Deja que el chef elija por ti.
            </p>

            <button
              onClick={consumirApiExterna}
              disabled={cargandoApi}
              style={{
                background: cargandoApi ? '#444' : '#7A1737',
                color: '#fff',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                padding: '0.8rem 1.4rem',
                borderRadius: '30px',
                fontWeight: 600,
                cursor: cargandoApi ? 'not-allowed' : 'pointer',
                marginBottom: '1.2rem',
              }}
            >
              {cargandoApi ? 'El chef está eligiendo...' : 'Sorpréndeme'}
            </button>

            {errorApi && (
              <div style={{ background: '#7f1d1d', border: '1px solid #991b1b', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', color: '#fca5a5' }}>
                {errorApi}
              </div>
            )}

            {platoSorpresa && (
              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center', background: '#151013', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '14px', padding: '1rem' }}>
                <img
                  src={platoSorpresa.imagen}
                  alt={platoSorpresa.nombre}
                  style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <span style={{ color: '#F0D77A', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {platoSorpresa.pais} · {platoSorpresa.categoria}
                  </span>
                  <h3 style={{ color: '#D4AF37', margin: '0.3rem 0' }}>{platoSorpresa.nombre}</h3>
                  <p style={{ color: '#F4C6D5', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 0.8rem' }}>
                    ${platoSorpresa.precio.toLocaleString('es-CO')}
                  </p>
                  <button
                    onClick={() => agregarAlCarrito(platoSorpresa)}
                    style={{ background: 'rgba(122, 23, 55, 0.3)', color: '#F4C6D5', border: '1px solid rgba(212, 175, 55, 0.45)', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ===== Tema 3: Opiniones de clientes ===== */}
          <section className={styles.seccion}>
            <h2 className={styles.tituloSeccion}>Opiniones de nuestros clientes ({opiniones.length})</h2>

            <FormularioOpinion onAgregarOpinion={agregarOpinion} />

            {opiniones.length === 0 ? (
              <p className={styles.sinResultados}>Aún no hay opiniones. ¡Sé el primero en contarnos tu experiencia!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {opiniones.map((opinion) => (
                  <article
                    key={opinion.id}
                    style={{ background: '#151013', border: '1px solid rgba(232, 160, 184, 0.18)', borderRadius: '12px', padding: '1rem' }}
                  >
                    <div style={{ color: '#D4AF37', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                      {estrellas(opinion.calificacion)}
                    </div>
                    <p style={{ color: '#BEB4B8', margin: '0 0 0.6rem', lineHeight: 1.5 }}>{opinion.comentario}</p>
                    <strong style={{ color: '#F4C6D5', fontSize: '0.9rem' }}>— {opinion.nombre}</strong>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </Restaurante>
  );
}