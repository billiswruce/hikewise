import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import styles from "../../styles/CreateTrail.module.scss";

interface TrailLocationPickerProps {
  latitude: number;
  longitude: number;
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  onPlaceSelected: () => void;
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
}

const TrailLocationPicker = ({
  latitude,
  longitude,
  onMapClick,
  onPlaceSelected,
  autocompleteRef,
}: TrailLocationPickerProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.googleMapContainer}>
      <div className={styles.autocompleteWrapper}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceSelected}>
          <input
            type="text"
            placeholder={t("searchLocation")}
            className={styles.input}
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerClassName={styles.googleMapContainer}
        zoom={10}
        center={{
          lat: latitude,
          lng: longitude,
        }}
        options={{
          disableDefaultUI: false,
          gestureHandling: "greedy",
          keyboardShortcuts: true,
        }}
        onClick={onMapClick}>
        <Marker
          position={{
            lat: latitude,
            lng: longitude,
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default TrailLocationPicker;
