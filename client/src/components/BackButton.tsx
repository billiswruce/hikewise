import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/BackButton.module.scss";

const BackButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => navigate(-1)}
      className={styles.backButton}
      aria-label={t("back")}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );
};

export default BackButton;
