const JSON_API_URL = "https://ggabi40.github.io/alquilar-api/provincias_localidades_argentina.json";

let provinciasCache = []; // para guardar los datos en memoria una vez cargados

export const getProvinces = async () => {
  try {
    if (provinciasCache.length > 0) return provinciasCache.map(p => p.nombre);

    const res = await fetch(JSON_API_URL);
    const data = await res.json();

    provinciasCache = data.provincias;
    console.log("Provincias disponibles:", provinciasCache.length);

    return provinciasCache.map(p => p.nombre);
  } catch (error) {
    console.error("Error cargando provincias:", error);
    return [];
  }
};

export const getLocalitiesByProvince = async (provinceName) => {
  try {
    if (provinciasCache.length === 0) {
      const res = await fetch(JSON_API_URL);
      const data = await res.json();
      provinciasCache = data.provincias;
    }

    const normalizar = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const provincia = provinciasCache.find(
      p => normalizar(p.nombre) ===
        normalizar(provinceName)
    );

    if (!provincia || !Array.isArray(provincia.localidades)) {
      console.warn(`No se encontró la provincia: ${provinceName}`);
      return [];
    }

    console.log(`Localidades encontradas para ${provinceName}:`, provincia.localidades.length);
    return provincia.localidades
      .filter(loc => loc)
      .map(loc => loc.nombre)
      .sort();
  } catch (error) {
    console.error("Error cargando localidades:", error);
    return [];
  }
};