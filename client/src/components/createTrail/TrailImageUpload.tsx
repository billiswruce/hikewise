import { useTranslation } from "react-i18next";
import styles from "../../styles/CreateTrail.module.scss";

interface TrailImageUploadProps {
  image: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 1200;
const QUALITY = 0.7;

const TrailImageUpload = ({ image, onImageUpload }: TrailImageUploadProps) => {
  const { t } = useTranslation();

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
            if (width > height) {
              height = (height / width) * MAX_IMAGE_DIMENSION;
              width = MAX_IMAGE_DIMENSION;
            } else {
              width = (width / height) * MAX_IMAGE_DIMENSION;
              height = MAX_IMAGE_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedImage = canvas.toDataURL("image/webp", QUALITY);
          resolve(compressedImage);
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(t("imageTooBig", { size: MAX_FILE_SIZE / (1024 * 1024) }));
      return;
    }

    try {
      const compressedImage = await compressImage(file);
      const event = {
        ...e,
        target: {
          ...e.target,
          result: compressedImage,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onImageUpload(event);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert(t("errorCompressingImage"));
    }
  };

  return (
    <div className={styles.imageSection}>
      <div className={styles.fileInputWrapper}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />
        <small className={styles.imageInfo}>
          {t("maxImageSize", { size: MAX_FILE_SIZE / (1024 * 1024) })}
        </small>
      </div>
      <div className={styles.imageContainer}>
        {image && (
          <img
            src={image}
            alt={t("trailImage")}
            className={styles.previewImage}
          />
        )}
      </div>
    </div>
  );
};

export default TrailImageUpload;
