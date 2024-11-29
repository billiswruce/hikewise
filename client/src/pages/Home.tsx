import backgroundImage from "../assets/bg.webp";
import Login from "../components/Login";
import styles from "../styles/Home.module.scss";

const Home = () => {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.hero}>
        <h1 className={styles.title}>HikeWise</h1>
        <div className={styles.buttonContainer}>
          <Login />
        </div>
      </div>
    </div>
  );
};

export default Home;
