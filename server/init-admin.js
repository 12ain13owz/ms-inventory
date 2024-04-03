const config = require("config");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const dialect = config.get("database.dialect");
const storage = config.get("database.storage");

const sequelize = new Sequelize({
  dialect: dialect,
  storage: storage,
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: "รูปแบบ E-mail ไม่ถูกต้อง" } },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    remark: {
      type: DataTypes.TEXT,
    },
  },
  {
    indexes: [{ fields: ["email"] }],
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

async function generateUser() {
  const password = "!Qwer1234";
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = new User({
    email: "admin@test.com",
    password: hash,
    firstname: "Dryst",
    lastname: "Admin",
    role: "admin",
    active: true,
    remark: "",
  });

  await User.create(user.dataValues);
}

generateUser();
