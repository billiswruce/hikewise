import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getWeatherIcon } from "../../utils/weatherUtils";
import styles from "../../styles/SingleTrail.module.scss";
import { SingleTrailData } from "../../models/SingleTrail";

interface TrailHeaderProps {
  trail: SingleTrailData;
  isEditing: boolean;
  formData: SingleTrailData | null;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TrailHeader = ({
  trail,
  isEditing,
  formData,
  handleEditChange,
}: TrailHeaderProps) => {
  const { t } = useTranslation();

  const weatherInfo = getWeatherIcon(trail.weather.description, t);

  return (
    <div className={styles.titleWeatherContainer}>
      {isEditing ? (
        <input
          type="text"
          name="name"
          value={formData?.name || ""}
          onChange={handleEditChange}
          className={styles.editInput}
        />
      ) : (
        <h2>{trail.name}</h2>
      )}
      <div className={styles.weatherInfo}>
        <FontAwesomeIcon
          icon={weatherInfo.icon}
          size="2x"
          title={weatherInfo.label}
        />
        <p>{Math.floor(trail.weather.temperature)}°C</p>
        <p>{weatherInfo.label}</p>
      </div>
    </div>
  );
};
