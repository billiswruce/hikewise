import { useTranslation } from "react-i18next";
import styles from "../../styles/SingleTrail.module.scss";
import { SingleTrailData } from "../../models/SingleTrail";
import { Difficulty } from "../../models/enums";
import LoadingScreen from "../LoadingScreen";
import TrailLocationPicker from "../createTrail/TrailLocationPicker";

interface TrailInfoProps {
  trail: SingleTrailData;
  isEditing: boolean;
  isSaving: boolean;
  formData: SingleTrailData | null;
  handleEditChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleEditSubmit: (e: React.FormEvent) => void;
  setIsEditing: (value: boolean) => void;
  handleDelete: () => void;
  editLatitude: number;
  editLongitude: number;
  handleMapClick: (e: google.maps.MapMouseEvent) => void;
  handlePlaceSelected: () => void;
  autocompleteRef: React.RefObject<google.maps.places.Autocomplete>;
}

export const TrailInfo = ({
  trail,
  isEditing,
  isSaving,
  formData,
  handleEditChange,
  handleEditSubmit,
  setIsEditing,
  handleDelete,
  editLatitude,
  editLongitude,
  handleMapClick,
  handlePlaceSelected,
  autocompleteRef,
}: TrailInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.basicInfo}>
      {isEditing ? (
        isSaving ? (
          <LoadingScreen />
        ) : (
          <form onSubmit={handleEditSubmit} className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>{t("name")}</label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleEditChange}
                className={styles.editInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("length")}</label>
              <input
                type="number"
                name="length"
                value={formData?.length || ""}
                onChange={handleEditChange}
                className={styles.editInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("difficulty")}</label>
              <select
                name="difficulty"
                value={formData?.difficulty || ""}
                onChange={handleEditChange}
                className={styles.editSelect}>
                {Object.values(Difficulty).map((diff) => (
                  <option key={diff} value={diff}>
                    {t(diff)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{t("description")}</label>
              <textarea
                name="description"
                value={formData?.description || ""}
                onChange={handleEditChange}
                className={styles.editTextarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("location")}</label>
              <TrailLocationPicker
                latitude={editLatitude}
                longitude={editLongitude}
                onMapClick={handleMapClick}
                onPlaceSelected={handlePlaceSelected}
                autocompleteRef={autocompleteRef}
                isOptional={true}
              />
            </div>

            <div className={styles.dateGroup}>
              <div className={styles.formGroup}>
                <label>{t("startDate")}</label>
                <input
                  type="date"
                  name="hikeDate"
                  value={formData?.hikeDate?.split("T")[0] || ""}
                  onChange={handleEditChange}
                  className={styles.editInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("endDate")}</label>
                <input
                  type="date"
                  name="hikeEndDate"
                  value={formData?.hikeEndDate?.split("T")[0] || ""}
                  min={formData?.hikeDate?.split("T")[0]}
                  onChange={handleEditChange}
                  className={styles.editInput}
                />
              </div>
            </div>

            <div className={styles.editButtons}>
              <button type="submit" className={styles.saveButton}>
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}>
                {t("cancel")}
              </button>
            </div>
          </form>
        )
      ) : (
        <>
          <div className={styles.infoHeader}>
            <div className={styles.infoContent}>
              <p className={styles.trailLocation}>{trail.location}</p>
              <p className={styles.trailDates}>
                {new Date(trail.hikeDate).toLocaleDateString()} -{" "}
                {new Date(trail.hikeEndDate).toLocaleDateString()}
              </p>
              <div className={styles.trailStats}>
                <p className={styles.trailLength}>{trail.length} km</p>
                <p className={styles.trailDifficulty}>{t(trail.difficulty)}</p>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}>
                {t("edit")}
              </button>
              <button onClick={handleDelete} className={styles.deleteButton}>
                {t("delete")}
              </button>
            </div>
          </div>
          <p className={styles.description}>{trail.description}</p>
        </>
      )}
    </div>
  );
};
