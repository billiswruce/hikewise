import {
  GoogleMap,
  Marker,
  Autocomplete,
  Libraries,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import styles from "../../styles/SingleTrail.module.scss";

// Add static libraries array and export it
export const libraries: Libraries = ["places"];

interface TrailLocationPickerProps {
  latitude: number;
  longitude: number;
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  onPlaceSelected: () => void;
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
  isOptional?: boolean;
}

const TrailLocationPicker = ({
  latitude,
  longitude,
  onMapClick,
  onPlaceSelected,
  autocompleteRef,
  isOptional = false,
}: TrailLocationPickerProps) => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adjustAutocompleteDropdown = () => {
      const pacContainer = document.querySelector(
        ".pac-container"
      ) as HTMLElement;
      if (pacContainer && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Beräkna om det finns plats under input
        const spaceBelow = viewportHeight - rect.bottom;
        const containerHeight = Math.min(300, spaceBelow - 10); // Max 300px höjd

        // Grundläggande positionering
        pacContainer.style.position = "fixed";
        pacContainer.style.width = `${rect.width}px`;
        pacContainer.style.left = `${rect.left}px`;
        pacContainer.style.maxHeight = `${containerHeight}px`;

        // Placera ovanför eller under beroende på utrymme
        if (spaceBelow < 200 && rect.top > 300) {
          pacContainer.style.top = `${rect.top - containerHeight - 5}px`;
        } else {
          pacContainer.style.top = `${rect.bottom + 5}px`;
        }

        // Säkerställ att container är synlig
        pacContainer.style.visibility = "visible";
        pacContainer.style.opacity = "1";
        pacContainer.style.zIndex = "9999";
      }
    };

    // Hantera resize och scroll
    const handleViewportChange = () => {
      requestAnimationFrame(adjustAutocompleteDropdown);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    // Observer för att fånga när pac-container skapas/uppdateras
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length || mutation.type === "attributes") {
          requestAnimationFrame(adjustAutocompleteDropdown);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Initial justering
    adjustAutocompleteDropdown();

    // Cleanup funktion
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);

      // Ta bort alla pac-containers när komponenten unmountas
      const pacContainers = document.querySelectorAll(".pac-container");
      pacContainers.forEach((container) => {
        container.remove();
      });
    };
  }, []);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.autocompleteWrapper} ref={wrapperRef}>
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
            autocomplete.setFields(["geometry.location", "formatted_address"]);
          }}
          onPlaceChanged={onPlaceSelected}>
          <input
            type="text"
            placeholder={t("searchLocation")}
            className={styles.input}
            required={!isOptional}
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
          scrollwheel: true,
          zoomControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeControl: false,
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
