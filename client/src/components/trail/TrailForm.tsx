import { useTranslation } from "react-i18next";
import styles from "../../styles/CreateTrail.module.scss";
import stylesButton from "../../styles/Buttons.module.scss";
import placeholderImage from "../../assets/trailPlaceholdersquare.webp";
import TrailLocationPicker from "./TrailLocationPicker";
import { useRef, useEffect } from "react";
import { useState } from "react";

interface TrailFormProps {
  formData: {
    name: string;
    length: string;
    difficulty: string;
    description: string;
    hikeDate: string;
    hikeEndDate: string;
    image: string;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
  const [latitude, setLatitude] = useState(57.7089);
  const [longitude, setLongitude] = useState(11.9746);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLatitude(e.latLng.lat());
      setLongitude(e.latLng.lng());
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

        setLatitude(lat);
        setLongitude(lng);

        handleChange({
          target: { name: "latitude", value: lat.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
        handleChange({
          target: { name: "longitude", value: lng.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
        handleChange({
          target: { name: "location", value: location },
        } as React.ChangeEvent<HTMLInputElement>);
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

    // Observera ändringar i DOM
    const observer = new MutationObserver(adjustAutocompleteDropdown);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>{t("createTrail")}</h1>
      <input
        className={styles.input}
        type="text"
        name="name"
        placeholder={t("trailName")}
        value={formData.name}
        onChange={handleChange}
      />
      <input
        className={styles.input}
        type="number"
        name="length"
        placeholder={t("length")}
        value={formData.length}
        onChange={handleChange}
      />
      <select
        className={styles.select}
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}>
        <option value="">{t("difficulty")}</option>
        <option value="easy">{t("easy")}</option>
        <option value="medium">{t("medium")}</option>
        <option value="hard">{t("hard")}</option>
        <option value="epic">{t("epic")}</option>
      </select>
      <textarea
        className={styles.textarea}
        name="description"
        placeholder={t("description")}
        value={formData.description}
        onChange={handleChange}
      />
      <label className={styles.dateInputContainer}>
        <input
          className={styles.dateInput}
          type="date"
          name="hikeDate"
          value={formData.hikeDate}
          onChange={handleChange}
        />
        <span>{t("hikeDate")}</span>
      </label>

      <label className={styles.dateInputContainer}>
        <input
          className={styles.dateInput}
          type="date"
          name="hikeEndDate"
          value={formData.hikeEndDate}
          onChange={handleChange}
        />
        <span>{t("hikeEndDate")}</span>
      </label>

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
                } as React.ChangeEvent<HTMLInputElement>;
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
      <TrailLocationPicker
        latitude={latitude}
        longitude={longitude}
        onMapClick={handleMapClick}
        onPlaceSelected={handlePlaceSelected}
        autocompleteRef={autocompleteRef}
      />
      <button type="submit" className={stylesButton.submitButton}>
        {t("createTrail")}
      </button>
    </form>
  );
};

export default TrailForm;
