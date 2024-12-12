import styles from "../styles/LoadingScreen.module.scss";
import Logo from "../assets/logo.png";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.content}>
        <img src={Logo} alt="Logo" className={styles.logo} />
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
