import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/CookieBanner.module.scss";

interface CookieBannerProps {
  onAccept: () => void;
}

const CookieBanner = ({ onAccept }: CookieBannerProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.content}>
        <p>{t("cookieConsent.message")}</p>
        <button onClick={handleAccept} className={styles.acceptButton}>
          {t("cookieConsent.accept")}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
