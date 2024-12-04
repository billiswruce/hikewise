import { useTranslation } from "react-i18next";
import styles from "../../styles/CreateTrail.module.scss";
import placeholderImage from "../../assets/trailPlaceholdersquare.webp";

interface TrailImageUploadProps {
  image: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TrailImageUpload = ({ image, onImageUpload }: TrailImageUploadProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.imageSection}>
      <div className={styles.fileInputWrapper}>
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className={styles.fileInput}
        />
      </div>
      <div className={styles.imageContainer}>
        <img
          src={image || placeholderImage}
          alt={t("trailImage")}
          className={styles.previewImage}
        />
      </div>
    </div>
  );
};

export default TrailImageUpload;
