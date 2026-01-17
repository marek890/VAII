import "./Home.css";
import { Link } from "react-router-dom";
import { BsCalendarCheck } from "react-icons/bs";
import { IoCar } from "react-icons/io5";

function Home() {
  return (
    <div className="home-container">
      <div className="home-wrapper">
        <div className="home-card">
          <h1>Vitajte vo Vajku</h1>
          <p>Jednoduchý rezervačný systém pre autoservisy.</p>
        </div>

        <div className="home-grid">
          <Link to="/appointment" className="home-link">
            <BsCalendarCheck className="home-icon" />
            <h3>Vytvoriť rezerváciu</h3>
            <p>
              Vyberte vozidlo a zarezervujte si termín servisnej prehliadky.
            </p>
          </Link>

          <Link to="/vehicles" className="home-link">
            <IoCar className="home-icon" />
            <h3>Moje vozidlá</h3>
            <p>
              Spravujte svoje autá — pridávajte nové alebo upravujte existujúce.
            </p>
          </Link>
        </div>

        <div className="help-card">
          <h3>Potrebujete pomoc?</h3>
          <p>
            Kontaktujte nás: <span>+421 900 123 456</span>
            <br />
            Email: <span>info@vajko.sk</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
