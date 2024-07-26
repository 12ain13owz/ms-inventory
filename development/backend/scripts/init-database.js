const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../data/database/ms_inventory.sqlite",
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
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    indexes: [{ fields: ["email"] }],
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

const Log = sequelize.define(
  "Log",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    track: { type: DataTypes.STRING(12), allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    oldCode: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    receivedDate: { type: DataTypes.DATEONLY, allowNull: false },
    remark: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    isCreated: { type: DataTypes.BOOLEAN, allowNull: false },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    categoryName: { type: DataTypes.STRING, allowNull: false },
    statusName: { type: DataTypes.STRING, allowNull: false },
    fundName: { type: DataTypes.STRING, allowNull: false },
    locationName: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      { fields: ["track"] },
      { fields: ["code"] },
      { fields: ["createdAt"] },
    ],
    sequelize,
    modelName: "Log",
    timestamps: false,
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
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    remark: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    indexes: [{ fields: ["name"] }],
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
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    remark: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    indexes: [{ fields: ["name"] }],
    sequelize,
    modelName: "Status",
    timestamps: true,
  }
);

const Fund = sequelize.define(
  "Fund",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    remark: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    indexes: [{ fields: ["name"] }],
    sequelize,
    modelName: "Fund",
    timestamps: true,
  }
);

const Location = sequelize.define(
  "Location",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    remark: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    indexes: [{ fields: ["name"] }],
    sequelize,
    modelName: "Location",
    timestamps: true,
  }
);

const Inventory = sequelize.define(
  "Inventory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    track: { type: DataTypes.STRING(7), allowNull: false, unique: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    oldCode: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    receivedDate: { type: DataTypes.DATEONLY, allowNull: false },
    remark: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Category, key: "id" },
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Status, key: "id" },
    },
    fundId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Fund, key: "id" },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Location, key: "id" },
    },
  },
  {
    indexes: [
      { fields: ["track"] },
      { fields: ["code"] },
      { fields: ["createdAt"] },
    ],
    sequelize,
    modelName: "Inventory",
    timestamps: true,
  }
);

const InventoryCheck = sequelize.define(
  "InventoryCheck",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    year: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    inventoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Inventory, key: "id" },
    },
  },
  {
    indexes: [{ fields: ["createdAt"] }, { fields: ["inventoryId"] }],
    sequelize,
    modelName: "InventoryCheck",
    timestamps: false,
  }
);

Inventory.belongsTo(User, { foreignKey: "userId" });
Inventory.belongsTo(Category, { foreignKey: "categoryId" });
Inventory.belongsTo(Status, { foreignKey: "statusId" });
Inventory.belongsTo(Fund, { foreignKey: "fundId" });
Inventory.belongsTo(Location, { foreignKey: "locationId" });

User.hasMany(Inventory, { foreignKey: "userId" });
Category.hasMany(Inventory, { foreignKey: "categoryId" });
Status.hasMany(Inventory, { foreignKey: "statusId" });
Fund.hasMany(Inventory, { foreignKey: "fundId" });
Location.hasMany(Inventory, { foreignKey: "locationId" });

InventoryCheck.belongsTo(Inventory, { foreignKey: "inventoryId" });
Inventory.hasMany(InventoryCheck, { foreignKey: "inventoryId" });

const envContent = `
PORT="your_port"
NODE_ENV="your_node_env"
USER_MAIL="your_email"
PASS_MAIL="your_app_passwords"
WHITE_LIST="your_url"
DATABASE_DIR="your_database_dir"

RECAPTCHA_SITE_KEY="your_recaptcha_site_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key"

ACCESS_TOKEN_PRIVATE_KEY="your_access_token_private_key"
ACCESS_TOKEN_PUBLIC_KEY="your_access_token_public_key"

REFRESH_TOKEN_PRIVATE_KEY="your_refresh_token_private_key"
REFRESH_TOKEN_PUBLIC_KEY="your_refresh_token_public_key"
`;

async function generateAdmin() {
  const email = "admin@mis.com";
  const password = "!Qwer1234";
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const result = await User.findOne({ where: { email: email } });
  if (result) return;

  const user = new User({
    email: email,
    password: hash,
    firstname: "Administrator",
    lastname: "MIS",
    role: "admin",
    active: true,
    remark: "",
  });

  await user.save();
}

async function generateCategory() {
  const categories = [
    { name: "CPU", active: true, remark: "" },
    { name: "Main board", active: true, remark: "" },
    { name: "Display Card", active: true, remark: "" },
    { name: "RAM", active: true, remark: "" },
    { name: "Hard disk", active: true, remark: "" },
    { name: "Power Supply", active: true, remark: "" },
    { name: "Case", active: true, remark: "" },
    { name: "Keyboard", active: true, remark: "" },
    { name: "Mouse", active: true, remark: "" },
  ];

  for (const category of categories) {
    const result = await Category.findOne({ where: { name: category.name } });
    if (result) continue;

    await new Category(category).save();
  }
}

async function generateStatus() {
  const statuses = [
    { name: "ปกติ", active: true, remark: "" },
    { name: "ชำรุด", active: true, remark: "" },
    { name: "เสื่อมคุณภาพ", active: true, remark: "" },
    { name: "สูญหาย", active: true, remark: "" },
  ];

  for (const status of statuses) {
    const result = await Status.findOne({ where: { name: status.name } });
    if (result) continue;

    await new Status(status).save();
  }
}

async function generateFund() {
  const funds = [
    { name: "งบประมาณแผ่นดิน", active: true, remark: "" },
    { name: "งบบำรุงการศึกษา", active: true, remark: "" },
    { name: "อื่น ๆ", active: true, remark: "" },
  ];

  for (const fund of funds) {
    const result = await Fund.findOne({ where: { name: fund.name } });
    if (result) continue;

    await new Fund(fund).save();
  }
}

async function generateLocation() {
  const locations = [
    { name: "741", active: true, remark: "" },
    { name: "742", active: true, remark: "" },
    { name: "743", active: true, remark: "" },
    { name: "744", active: true, remark: "" },
    { name: "745", active: true, remark: "" },
    { name: "746", active: true, remark: "" },
    { name: "747", active: true, remark: "" },
    { name: "748", active: true, remark: "" },
    { name: "อื่น ๆ", active: true, remark: "" },
  ];

  for (const location of locations) {
    const result = await Location.findOne({ where: { name: location.name } });
    if (result) continue;

    await new Location(location).save();
  }
}

async function initializeDatabase() {
  try {
    console.log("1. Create Database");

    await sequelize.authenticate();
    console.log("2. Check connect database.");

    await sequelize.sync();
    console.log("3. Create table.");

    await generateAdmin();
    console.log("4. Generate admin.");

    // await generateCategory();
    // console.log("5. Generate category.");

    await generateStatus();
    console.log("6. Generate status.");

    await generateFund();
    console.log("7. Generate fund.");

    await generateLocation();
    console.log("8. Generate location.");

    await sequelize.close();
    console.log("9. Disconnect database.");

    const envFilePath = path.join(__dirname, "../.env");
    console.log(envFilePath);
    if (!fs.existsSync(envFilePath)) {
      fs.writeFileSync("../.env", envContent, "utf8");
      console.log("10. Create .env");
    }

    console.log("successfully");
  } catch (error) {
    console.log("Error!", error);
  }
}

console.log(1);
initializeDatabase();
