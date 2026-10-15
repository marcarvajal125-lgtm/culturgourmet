import styles from './Navbar.module.css';

interface NavbarProps {
  cantidad: number;
  onAbrirCarrito: () => void;
}

export const Navbar = ({ cantidad, onAbrirCarrito }: NavbarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.marca}>
        <img src="/img/logo/cg.png" alt="Logo Culturgourmet" />
        <span>Culturgourmet</span>
      </div>

      <button className={styles.carrito} onClick={onAbrirCarrito}>
         Carrito
        <span className={styles.contador}>{cantidad}</span>
      </button>
    </nav>
  );
};