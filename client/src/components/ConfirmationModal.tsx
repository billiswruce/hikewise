import React from "react";
import styles from "../styles/Modal.module.scss";
import { useTranslation } from "react-i18next";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  message,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{message}</h2>
        <p>{t("trailCreatedInfo")}</p>
        <div className={styles.modalActions}>
          <button className={styles.primaryButton} onClick={onNavigate}>
            {t("goToTrails")}
          </button>
          <button className={styles.secondaryButton} onClick={onClose}>
            {t("stayOnPage")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
