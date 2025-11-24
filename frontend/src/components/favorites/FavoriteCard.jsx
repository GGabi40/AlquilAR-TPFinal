import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { formatApproxAddress } from "../../services/formatAddress";

const FavoriteCard = ({ property, onRemove, isFavorite }) => {
    return (
        <div className="border rounded-2xl overflow-hidden shadow hover:shadow-md transition relative">
            <img
                src={property.image || "/placeholder.jpg"}
                alt={property.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h2 className="font-medium text-lg truncate">{property.title}</h2>
                <p className="text-sm text-gray-600 truncate">{formatApproxAddress(property.address)}</p>
                <p className="font-semibold mt-2">${property.price}</p>
            </div>

            <button
                onClick={onRemove}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
                <FontAwesomeIcon 
                icon={isFavorite ? solidHeart : regularHeart}
                className={isFavorite ? "text-red-500" : "text-grey-400"} />
            </button>
        </div>
    );
};

export default FavoriteCard;