import { faSun, faCloud, faCloudRain, faSnowflake, faSmog, faBolt } from "@fortawesome/free-solid-svg-icons";

export const getWeatherIcon = (description: string, t: (key: string) => string) => {
  const desc = description.toLowerCase();

  if (desc.includes("clear sky") || desc.includes("sunny"))
    return { icon: faSun, label: t("weather.clearSky") };
  if (desc.includes("few clouds") || desc.includes("clouds"))
    return { icon: faCloud, label: t("weather.clouds") };
  if (desc.includes("rain") || desc.includes("shower"))
    return { icon: faCloudRain, label: t("weather.rain") };
  if (desc.includes("thunderstorm"))
    return { icon: faBolt, label: t("weather.thunderstorm") };
  if (desc.includes("snow"))
    return { icon: faSnowflake, label: t("weather.snow") };
  if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze"))
    return { icon: faSmog, label: t("weather.mist") };

  return { icon: faSun, label: t("weather.default") };
}; 