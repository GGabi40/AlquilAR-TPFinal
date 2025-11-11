import axios from "axios";

const JSON_API_URL =
  "https://ggabi40.github.io/alquilar-api/provincias_localidades_argentina.json";

let provinciasCache = [];

export const getProvinces = async () => {
  try {
    // Si ya tenemos los datos cargados, devolvemos solo los nombres
    if (provinciasCache.length > 0)
      return provinciasCache.map((p) => p.nombre);

    const res = await axios.get(JSON_API_URL);
    const data = res.data;

    provinciasCache = data.provincias;

    return provinciasCache.map((p) => p.nombre);
  } catch (error) {
    console.error("Error cargando provincias:", error.message);
    return [];
  }
};

export const getLocalitiesByProvince = async (provinceName) => {
  try {
    // Si aún no está en cache, la cargamos
    if (provinciasCache.length === 0) {
      const res = await axios.get(JSON_API_URL);
      const data = res.data;
      provinciasCache = data.provincias;
    }

    const normalizar = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const provincia = provinciasCache.find(
      (p) => normalizar(p.nombre) === normalizar(provinceName)
    );

    if (!provincia || !Array.isArray(provincia.localidades)) {
      console.warn(`No se encontró la provincia: ${provinceName}`);
      return [];
    }

    return provincia.localidades
      .filter((loc) => loc)
      .map((loc) => loc.nombre)
      .sort();
  } catch (error) {
    console.error("Error cargando localidades:", error.message);
    return [];
  }
};
