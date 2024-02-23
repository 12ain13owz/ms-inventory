require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const sequlize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/ms_stock_2.sqlite",
});

let User = null;

Run();

async function Run() {
  try {
    console.log("1. Create Database ms_stock.sqlite success.");

    await sequlize.authenticate();
    console.log("2. Check connect database success.");

    await initTableUser();
    await sequlize.sync();
    console.log("3. Create table success.");

    await initDataUser();
    console.log("4. Generate user Admin success.");

    await sequlize.close();
    console.log("5. Disconnect database success.");
  } catch (error) {
    console.error("Error! Unable to connect to the database:", error);
  }
}

async function initTableUser() {
  User = sequlize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
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
      defaultValue: "user",
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    remark: {
      type: DataTypes.STRING,
    },
  });
}

async function initDataUser() {
  const user = {
    email: "test@t.com",
    password: bcrypt.hashSync("123456", 10),
    firstname: "Admin",
    lastname: "Amin",
    role: "admin",
    active: true,
    remark: "",
  };

  await User.create(user);
}
