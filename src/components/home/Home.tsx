import './Home.css';
import { FaGuitar, FaKeyboard, FaDrum } from 'react-icons/fa';

const Home = () => {
  return (
    
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenido a MusicShop 🎸</h1>
        <p>Encuentra los mejores instrumentos al mejor precio.</p>
      </header>

      <div className="decorative-line"></div>

      <section className="featured-section">
        <h2>Instrumentos Destacados</h2>
        <div className="featured-cards">
          <div className="card">
            <FaGuitar className="icon" />
            <img src="/images/Guitarra.png" alt="Guitarra" />
            <h3>Guitarra Eléctrica</h3>
          </div>
          <div className="card">
            <FaKeyboard className="icon" />
            <img src="/images/Teclado.png" alt="Teclado" />
            <h3>Teclado Profesional</h3>
          </div>
          <div className="card">
            <FaDrum className="icon" />
            <img src="/images/Bateria.png" alt="Batería" />
            <h3>Batería Completa</h3>
          </div>
        </div>
      </section>

      <section className="quotes-section">
        <div className="quote">“La música es la literatura del corazón.” – Alphonse de Lamartine</div>
        <div className="quote">“La música es el lenguaje universal de la humanidad.” – Henry Wadsworth Longfellow</div>
        <div className="quote">“Donde las palabras fallan, la música habla.” – Hans Christian Andersen</div>
        <div className="quote">“La vida es como la música: debe ser compuesta por cada uno de nosotros.” – William A. Ward</div>
      </section>

      <h2 className='Frase'>"Tu pasión por la música merece lo mejor. Ven y explora nuestra selección de instrumentos de alta calidad, donde cada compra se convierte en parte de tu historia musical."</h2>

      <footer className="home-footer">
        <p>© 2024 MusicShop - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Home;
