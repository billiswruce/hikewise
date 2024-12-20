import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/LoginModal.module.scss";
import lonelyImage from "../assets/HIkerLonely1.png";
import hikersImage2 from "../assets/Hikers2.png";
import mapImage from "../assets/map.png";
import gearImage from "../assets/gearimage.png";
import backpackImage from "../assets/packlistimage.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const { t } = useTranslation();

  if (!isOpen) return null;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderContent = () => {
    switch (step) {
      case 1:
        return { title: t("modal.howItWorks"), image: lonelyImage };
      case 2:
        return { title: t("modal.step1"), image: mapImage };
      case 3:
        return { title: t("modal.step2"), image: gearImage };
      case 4:
        return { title: t("modal.step3"), image: backpackImage };
      default:
        return { title: t("modal.finished"), image: hikersImage2 };
    }
  };

  const { title, image } = renderContent();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Vänsterpil */}
        <div
          className={`${styles.arrow} ${styles.arrowLeft} ${
            step === 1 ? styles.disabled : ""
          }`}
          onClick={step > 1 ? prevStep : undefined}>
          {"<"}
        </div>

        {/* Innehåll */}
        <div className={styles.content}>
          <h2>{title}</h2>
          <img src={image} alt="Step Illustration" className={styles.image} />

          {/* Prickar för steg 1–4 */}
          {step <= 4 && (
            <div className={styles.dots}>
              {[1, 2, 3, 4].map((num) => (
                <span
                  key={num}
                  className={`${styles.dot} ${
                    step === num ? styles.active : ""
                  }`}
                />
              ))}
            </div>
          )}

          {/* Knapp för steg 5 */}
          {step === 5 && (
            <button className={styles.closeButton} onClick={onClose}>
              {t("modal.close")}
            </button>
          )}
        </div>

        {/* Högerpil */}
        <div
          className={`${styles.arrow} ${styles.arrowRight} ${
            step === 5 ? styles.disabled : ""
          }`}
          onClick={step < 5 ? nextStep : undefined}>
          {">"}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
