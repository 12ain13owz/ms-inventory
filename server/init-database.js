const { Sequelize, DataTypes } = require("sequelize");
const config = require("config");
const bcrypt = require("bcrypt");
const fs = require("fs");

const sequelize = new Sequelize({
  dialect: config.get("database.dialect"),
  storage: config.get("database.storage"),
});

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: "รูปแบบ E-mail ไม่ถูกต้อง" } },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    firstname: { type: DataTypes.STRING(50), allowNull: false },
    lastname: { type: DataTypes.STRING(50), allowNull: false },
    role: { type: DataTypes.ENUM("admin", "user"), allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    remark: { type: DataTypes.TEXT },
    passwordResetCode: { type: DataTypes.STRING },
    passwordExpired: { type: DataTypes.DATE },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    indexes: [{ unique: true, fields: ["email"] }],
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

const Parcel = sequelize.define(
  "Parcel",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    track: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    oldCode: { type: DataTypes.STRING },
    receivedDate: { type: DataTypes.DATEONLY, allowNull: false },
    detail: { type: DataTypes.TEXT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    print: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    remark: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    indexes: [
      { unique: true, fields: ["track"] },
      { unique: true, fields: ["code"] },
      { fields: ["createdAt"] },
    ],
    sequelize,
    modelName: "Parcel",
    timestamps: true,
  }
);

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    track: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING },
    oldCode: { type: DataTypes.STRING },
    receivedDate: { type: DataTypes.DATEONLY },
    detail: { type: DataTypes.STRING },
    quantity: { type: DataTypes.NUMBER },
    modifyQuantity: { type: DataTypes.NUMBER },
    firstname: { type: DataTypes.STRING },
    lastname: { type: DataTypes.STRING },
    categoryName: { type: DataTypes.STRING },
    statusName: { type: DataTypes.TEXT },
    remark: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    newParcel: { type: DataTypes.BOOLEAN },
    editParcel: { type: DataTypes.BOOLEAN },
    increaseQuantity: { type: DataTypes.BOOLEAN },
    decreaseQuantity: { type: DataTypes.BOOLEAN },
    print: { type: DataTypes.BOOLEAN },
    printCount: { type: DataTypes.NUMBER },
    detailLog: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
  },
  {
    indexes: [{ fields: ["track"] }, { fields: ["createdAt"] }],
    sequelize,
    modelName: "Log",
    timestamps: true,
    updatedAt: false,
  }
);

const Track = sequelize.define(
  "Track",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    sequelize,
    modelName: "Track",
    timestamps: false,
  }
);

const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    remark: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    indexes: [{ unique: true, fields: ["name"] }],
    sequelize,
    modelName: "Category",
    timestamps: true,
  }
);

const Status = sequelize.define(
  "Status",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    remark: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    indexes: [{ unique: true, fields: ["name"] }],
    sequelize,
    modelName: "Status",
    timestamps: true,
  }
);

User.hasMany(Parcel);
Category.hasMany(Parcel);
Status.hasMany(Parcel);

Parcel.belongsTo(User);
Parcel.belongsTo(Category);
Parcel.belongsTo(Status);

const envContent = `
PORT="3000"
NODE_ENV="development"
RECAPTCHA_SITE_KEY="your_recaptcha_site_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key"

ACCESS_TOKEN_PRIVATE_KEY="your_access_token_private_key"
ACCESS_TOKEN_PUBLIC_KEY="your_access_token_public_key"

REFRESH_TOKEN_PRIVATE_KEY="your_refresh_token_private_key"
REFRESH_TOKEN_PUBLIC_KEY="your_refresh_token_public_key"
`;

async function initializeDatabase() {
  try {
    console.log("1. Create Database ms_stock.sqlite.");

    await sequelize.authenticate();
    console.log("2. Check connect database.");

    await sequelize.sync();
    console.log("3. Create table.");

    await generateAdmin();
    console.log("4. Generate admin.");

    await generateCategory();
    console.log("5. Generate category.");

    await generateStatus();
    console.log("6. Generate status.");

    await sequelize.close();
    console.log("7. Disconnect database.");

    fs.writeFileSync(".env", envContent, "utf8");
    console.log("8. Create .env");

    console.log("successfully");
  } catch (error) {
    console.log("Error!", error);
  }
}

async function generateAdmin() {
  const password = "!Qwer1234";
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = new User({
    email: "admin@test.com",
    password: hash,
    firstname: "Administrator",
    lastname: "Test",
    role: "admin",
    active: true,
    remark: "",
  });

  await User.create(user.dataValues);
}

async function generateCategory() {
  const categories = [
    { name: "CPU", remark: "" },
    { name: "Main board", remark: "" },
    { name: "Display Card", remark: "" },
    { name: "RAM", remark: "" },
    { name: "Hard disk", remark: "" },
    { name: "Power Supply", remark: "" },
    { name: "Case", remark: "" },
    { name: "Keyboard", remark: "" },
    { name: "Mouse", remark: "" },
  ];

  for (const category of categories) {
    await Category.create(new Category(category).dataValues);
  }
}

async function generateStatus() {
  const statuses = [
    { name: "ปกติ", remark: "" },
    { name: "ชำรุด", remark: "" },
    { name: "เสื่อมคุณภาพ", remark: "" },
    { name: "สูญหาย", remark: "" },
    { name: "เขียนรหัสแล้ว", remark: "" },
    { name: "ปกติไม่ใช้", remark: "" },
  ];

  for (const status of statuses) {
    await Status.create(new Status(status).dataValues);
  }
}

initializeDatabase();
