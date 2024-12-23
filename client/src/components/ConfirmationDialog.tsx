import { useTranslation } from "react-i18next";
import styles from "../styles/ConfirmationDialog.module.scss";

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            {t("confirm")}
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
