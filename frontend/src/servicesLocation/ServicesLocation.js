const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

export const getProvinces = async () => {
  try {
    const res = await fetch("https://nominatim.openstreetmap.org/search.php?q=provincias%20de%20Argentina&format=jsonv2",
      {
        headers: {
          "User-Agent": "AlquilAR-App",
        },
        timeout: 1500,
      }
    );

    const data = await res.json();
    console.log("Datos de nominatim provincias: ", data.display_name);

    const provincias = [
      ...new Set(
        data
          .map((p) => {
            const name = p.display_name?.split(",")[4]?.trim();
            return name && name !== "Argentina" ? name : null;
          })
          .filter(Boolean)
      ),
    ].sort();

    console.log("provincias : ", provincias);
    return provincias;
  } catch (error) {
    console.error("Error cargando provincias desde Nominatim:", error);
    return [];
  }
};

export const getLocalitiesByProvince = async (province) => {
  try {
    const res = await fetch(
      `${NOMINATIM_BASE_URL}/search?country=Argentina&state=${encodeURIComponent(
        province
      )}&featuretype=city&format=json&addressdetails=1&limit=500`,
      {
        headers: {
          "User-Agent": "AlquilAR-App",
        },
      }
    );

    const data = await res.json();

    // Extraemos los nombres de localidades
    const localidades = [
      ...new Set(data.map((l) => l.address.city || l.address.town || l.display_name.split(",")[0])),
    ].sort();

    return localidades;
  } catch (error) {
    console.error("Error cargando localidades desde Nominatim:", error);
    return [];
  }
};