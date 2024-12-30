import {
  LoadScript,
  GoogleMap,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import styles from "../../styles/SingleTrail.module.scss";

interface TrailMapProps {
  latitude: number;
  longitude: number;
  libraries: Libraries;
}

export const TrailMap = ({ latitude, longitude, libraries }: TrailMapProps) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}>
      <GoogleMap
        mapContainerClassName={styles.map}
        center={{ lat: latitude, lng: longitude }}
        zoom={13}>
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    </LoadScript>
  );
};
