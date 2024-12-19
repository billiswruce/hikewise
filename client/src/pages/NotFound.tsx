import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.scss";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.notFoundContainer}
      style={{
        backgroundImage: `url('/HikersMist.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className={styles.content}>
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
