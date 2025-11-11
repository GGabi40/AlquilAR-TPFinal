import { useEffect, useState } from "react";
import axios from "axios";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/favorites", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(res.data);
            } catch (err) {
                console.error("Error al obtener favoritos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemove = async (propertyId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/favorites/${propertyId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(prev => prev.filter(p => p.id !== propertyId));
        } catch (err) {
            console.error("Error al eliminar favoritos:", err);
        }
    };

    if (!loading) return <p className="p-6">Cargando favoritos...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Mis Favoritos</h1>
            {favorites.length === 0 ? (
                <p>No tenés propiedades marcadas como favoritas.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
                    {favorites.map(property => (
                        <FavoriteCard
                            key={property.id}
                            property={property}
                            onRemove={() => handleRemove(property.id)}
                            isFavorite={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;