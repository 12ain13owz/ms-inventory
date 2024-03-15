import UserModel from './user.model';
import CategoryModel from './category.model';
import StatusModel from './status.model';
import ParcelModel from './parcel.model';

UserModel.hasMany(ParcelModel);
CategoryModel.hasMany(ParcelModel);
StatusModel.hasMany(ParcelModel);

ParcelModel.belongsTo(UserModel);
ParcelModel.belongsTo(CategoryModel);
ParcelModel.belongsTo(StatusModel);
