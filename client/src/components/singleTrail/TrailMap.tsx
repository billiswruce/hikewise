import { GoogleMap, Marker } from "@react-google-maps/api";
import styles from "../../styles/SingleTrail.module.scss";

interface TrailMapProps {
  latitude: number;
  longitude: number;
}

export const TrailMap = ({ latitude, longitude }: TrailMapProps) => {
  return (
    <GoogleMap
      mapContainerClassName={styles.map}
      center={{ lat: latitude, lng: longitude }}
      zoom={13}>
      <Marker position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  );
};
