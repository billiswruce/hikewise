import i18next from "i18next";
import middleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/translation.json"),
    },
    fallbackLng: "en",
    preload: ["en", "sv", "ja", "fr"],
    detection: {
      order: ["querystring", "header", "cookie"],
      caches: ["cookie"],
    },
  });

i18next.on("loaded", (loaded) => {
  console.log("Loaded translations:", loaded);
});

export default i18next;
