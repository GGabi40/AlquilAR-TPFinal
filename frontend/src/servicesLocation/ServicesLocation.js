export const getProvinces = async () => {
  const res = await fetch('https://apis.datos.gob.ar/georef/api/provincias');
  const data = await res.json();
  return data.provincias.map(p => p.nombre).sort();
};

export const getLocalitiesByProvince = async (province) => {
  const res = await fetch(
    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(province)}&max=5000`
  );
  const data = await res.json();
  return data.localidades.map(l => l.nombre).sort();
};