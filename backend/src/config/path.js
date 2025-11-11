import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadPath =
  process.env.NODE_ENV === "production"
    ? "/var/www/alquilar/uploads"
    : path.join(__dirname, "../uploads");
