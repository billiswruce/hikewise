import { useTranslation } from "react-i18next";
import styles from "../../styles/CreateTrail.module.scss";
import stylesButton from "../../styles/Buttons.module.scss";
import placeholderImage from "../../assets/trailPlaceholdersquare.webp";
import TrailLocationPicker from "./TrailLocationPicker";
import { useRef, useEffect } from "react";

type CustomChangeEvent = {
  target: { name: string; value: string | number };
};

interface TrailFormProps {
  formData: {
    name: string;
    length: string;
    difficulty: string;
    description: string;
    latitude: number;
    longitude: number;
    location: string;
    hikeDate: string;
    hikeEndDate: string;
    image: string;
  };
  handleChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | CustomChangeEvent
  ) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TrailForm = ({
  formData,
  handleChange,
  handleImageUpload,
  handleSubmit,
}: TrailFormProps) => {
  const { t } = useTranslation();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      handleChange({
        target: { name: "latitude", value: lat },
      } as CustomChangeEvent);

      handleChange({
        target: { name: "longitude", value: lng },
      } as CustomChangeEvent);
    }
  };

  const handlePlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location =
          place.formatted_address || place.name || t("unknownLocation");

        handleChange({
          target: { name: "latitude", value: lat },
        } as CustomChangeEvent);

        handleChange({
          target: { name: "longitude", value: lng },
        } as CustomChangeEvent);

        handleChange({
          target: { name: "location", value: location },
        } as CustomChangeEvent);
      } else {
        alert(t("noPlaceDataFound"));
      }
    }
  };

  useEffect(() => {
    const adjustAutocompleteDropdown = () => {
      const pacContainer = document.querySelector(
        ".pac-container"
      ) as HTMLElement;
      const autocompleteWrapper = document.querySelector(
        `.${styles.autocompleteWrapper}`
      ) as HTMLElement;

      if (pacContainer && autocompleteWrapper) {
        const rect = autocompleteWrapper.getBoundingClientRect();
        pacContainer.style.position = "absolute";
        pacContainer.style.top = `${rect.bottom}px`;
        pacContainer.style.left = `${rect.left}px`;
        pacContainer.style.width = `${rect.width}px`;
        pacContainer.style.zIndex = "1000";
      }
    };

    adjustAutocompleteDropdown();
    const observer = new MutationObserver(adjustAutocompleteDropdown);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.infoContainer}>
        <h1 className={styles.title}>{t("createTrail")}</h1>
        <h4 className={styles.info}> {t("createTrailInfo")}</h4>
      </div>
      <label htmlFor="trailName" className={styles.required}>
        {t("trailName")}
      </label>
      <input
        id="trailName"
        className={styles.input}
        type="text"
        name="name"
        placeholder={t("trailName")}
        value={formData.name}
        onChange={handleChange}
        required
      />
      <label htmlFor="trailLength" className={styles.required}>
        {t("length")}
      </label>
      <input
        id="trailLength"
        className={styles.input}
        type="number"
        name="length"
        placeholder={t("length")}
        value={formData.length}
        onChange={handleChange}
        required
      />
      <label htmlFor="trailDifficulty" className={styles.required}>
        {t("difficulty")}
      </label>
      <select
        id="trailDifficulty"
        className={styles.select}
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
        required>
        <option value="">{t("difficulty")}</option>
        <option value="easy">{t("easy")}</option>
        <option value="medium">{t("medium")}</option>
        <option value="hard">{t("hard")}</option>
        <option value="epic">{t("epic")}</option>
      </select>
      <label htmlFor="trailDescription" className={styles.required}>
        {t("description")}
      </label>
      <textarea
        id="trailDescription"
        className={styles.textarea}
        name="description"
        placeholder={t("description")}
        value={formData.description}
        onChange={handleChange}
        required
      />
      <div className={styles.dateInputContainer}>
        <span className={styles.required}>{t("startDate")}</span>
        <input
          id="hikeDate"
          type="date"
          name="hikeDate"
          value={formData.hikeDate}
          onChange={(e) => {
            handleChange(e);
            if (!formData.hikeEndDate) {
              handleChange({
                target: { name: "hikeEndDate", value: e.target.value },
              } as CustomChangeEvent);
            }
          }}
          required
        />
      </div>

      <div className={styles.dateInputContainer}>
        <span className={styles.required}>{t("endDate")}</span>
        <input
          id="hikeEndDate"
          type="date"
          name="hikeEndDate"
          value={formData.hikeEndDate}
          min={formData.hikeDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.fileInputWrapper}>
        <div className={styles.fileInputContainer}>
          <label htmlFor="fileInput">{t("chooseFile")}</label>
          <input
            id="fileInput"
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <span className={styles.fileStatus}>
          {formData.image ? formData.image.split("/").pop() : t("noFileChosen")}
        </span>
      </div>

      <div className={styles.imageContainer}>
        {formData.image ? (
          <>
            <img
              src={formData.image}
              alt={t("uploadedImage")}
              className={styles.image}
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => {
                const e = {
                  target: { name: "image", value: "" },
                } as CustomChangeEvent;
                handleChange(e);
              }}>
              {t("removeImage")}
            </button>
          </>
        ) : (
          <img
            src={placeholderImage}
            alt={t("placeholderImage")}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.formGroup}>
        <label>{t("location")}</label>
        <TrailLocationPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onMapClick={handleMapClick}
          onPlaceSelected={handlePlaceSelected}
          autocompleteRef={autocompleteRef}
          isOptional={false}
        />
      </div>
      <button type="submit" className={stylesButton.submitButton}>
        {t("createTrail")}
      </button>
    </form>
  );
};

export default TrailForm;
