import { Post } from "./Post.js";
import { Property } from "./Property.js";
import { PropertyDetails } from "./PropertyDetails.js";
import { PropertyImages } from "./PropertyImages.js";
import { PropertyDocuments } from "./PropertyDocuments.js";
import { PropertyLocality } from "./PropertyLocality.js";
import { PropertyProvince } from "./PropertyProvince.js";
import { PropertyVideos } from "./PropertyVideos.js";
import { Rating } from "./Rating.js";
import { Favorite } from "./Favorite.js";
import { Rental } from "./Rental.js";
import { User } from "./User.js";

/* --- PROPERTY --- */
User.hasMany(Property, { foreignKey: "ownerId" });
Property.belongsTo(User, { foreignKey: "ownerId" });

Property.hasMany(Post, { foreignKey: "propertyId" });
Post.belongsTo(Property, { foreignKey: "propertyId" });

Property.hasMany(Rental, { foreignKey: "propertyId" });
Rental.belongsTo(Property, { foreignKey: "propertyId" });

/* --- PROPERTY DETAILS --- */
Property.hasOne(PropertyDetails, { foreignKey: "propertyId" });
PropertyDetails.belongsTo(Property, { foreignKey: "propertyId" });

PropertyDetails.hasMany(PropertyImages, { foreignKey: "propertyDetailsId" });
PropertyImages.belongsTo(PropertyDetails, { foreignKey: "propertyDetailsId" });

PropertyDetails.hasMany(PropertyVideos, { foreignKey: "propertyDetailsId" });
PropertyVideos.belongsTo(PropertyDetails, { foreignKey: "propertyDetailsId" });

Property.hasMany(PropertyDocuments, { foreignKey: "propertyId" });
PropertyDocuments.belongsTo(Property, { foreignKey: "propertyId" });


/* --- RENTAL --- */
Post.hasOne(Rental, { as: "rental", foreignKey: "postId" });
Rental.belongsTo(Post, { as: "post", foreignKey: "postId" });

User.hasMany(Rental, { as: "tenantRentals", foreignKey: "tenantId" });
Rental.belongsTo(User, { as: "tenant", foreignKey: "tenantId" });


/* --- RATING --- */
User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Property.hasMany(Rating, { foreignKey: "propertyId" });
Rating.belongsTo(Property, { foreignKey: "propertyId" });


/* --- FAVORITES --- */
User.belongsToMany(Property, {
    through: "Favorite",
    as: "favoriteProperties",
    foreignKey: "userId"
});

Property.belongsToMany(User, {
    through: "Favorite",
    as: "usersWhoFavorited",
    foreignKey: "propertyId"
});
