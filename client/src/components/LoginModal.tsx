import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/LoginModal.module.scss";
import hikersImage from "../assets/Hikers1.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const { t } = useTranslation();

  if (!isOpen) return null;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderContent = () => {
    switch (step) {
      case 1:
        return <h2>{t("modal.step1")}</h2>;
      case 2:
        return <h2>{t("modal.step2")}</h2>;
      case 3:
        return <h2>{t("modal.step3")}</h2>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <img src={hikersImage} alt="Hikers" className={styles.hikersImage} />
        {renderContent()}
        <div className={styles.navigation}>
          {step > 1 && <button onClick={prevStep}>{t("modal.prev")}</button>}
          {step < 3 && <button onClick={nextStep}>{t("modal.next")}</button>}
          {step === 3 && <button onClick={onClose}>{t("modal.close")}</button>}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
