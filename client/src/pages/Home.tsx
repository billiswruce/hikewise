import backgroundImage from "../assets/bg.webp";
import Login from "../components/Login";
import styles from "../styles/Home.module.scss";
import logo from "../assets/Hikers1.png";

const Home = () => {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.card}>
        {" "}
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.content}>
          <h1 className={styles.title}>HikeWise</h1>
          <p className={styles.description}>Plan wisely, hike confidently.</p>
          <div className={styles.buttonContainer}>
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
