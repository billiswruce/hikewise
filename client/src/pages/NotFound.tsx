import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.scss";
import HikerMist from "../assets/HIkersMist.png";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <img src={HikerMist} alt="HikerMist" className={styles.hikerMist} />
        <h1>404</h1>
        <p>{t("notFound")}</p>
        <Link to="/" className={styles.homeLink}>
          {t("homePage")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
