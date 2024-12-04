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

  //   const handleMapClick = async (e: google.maps.MapMouseEvent) => {
  //     if (e.latLng) {
  //       const lat = e.latLng.lat();
  //       const lng = e.latLng.lng();
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         latitude: lat,
  //         longitude: lng,
  //       }));

  //       try {
  //         const response = await fetch(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
  //             import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  //           }`
  //         );
  //         const data = await response.json();
  //         console.log("Geocoding API Response:", data);

  //         if (data.status === "OK" && data.results && data.results[0]) {
  //           setFormData((prevData) => ({
  //             ...prevData,
  //             location: data.results[0].formatted_address,
  //           }));
  //         } else {
  //           console.warn(t("noAddressFound"));
  //         }
  //       } catch (error) {
  //         console.error(t("errorFetchingAddress"), error);
  //       }
  //     }
  //   };

  //   const handlePlaceSelected = () => {
  //     if (autocompleteRef.current) {
  //       const place = autocompleteRef.current.getPlace();
  //       if (place.geometry && place.geometry.location) {
  //         const lat = place.geometry.location.lat();
  //         const lng = place.geometry.location.lng();
  //         const location =
  //           place.formatted_address || place.name || t("unknownLocation");

  //         setFormData((prevData) => ({
  //           ...prevData,
  //           latitude: lat,
  //           longitude: lng,
  //           location,
  //         }));
  //       } else {
  //         alert(t("noPlaceDataFound"));
  //       }
  //     }
  //   }

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
