const { Sequelize, DataTypes } = require("sequelize");
const config = require("config");
const bcrypt = require("bcrypt");

const sequlize = new Sequelize({
  dialect: config.get("database.dialect"),
  storage: config.get("database.storage"),
});

Run();

async function Run() {
  try {
    console.log("1. Create Database ms_stock.sqlite.");

    await sequlize.authenticate();
    console.log("2. Check connect database.");

    await initTableUser();
    await sequlize.sync({ alter: true });
    console.log("3. Create table.");

    await initDataUser();
    console.log("4. Generate user Admin.");

    await sequlize.close();
    console.log("5. Disconnect database.");
  } catch (error) {
    console.log("Error! Unable to connect to the database:", error);
  }
}

async function initTableUser() {
  User = sequlize.define(
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
    },
    {
      indexes: [{ unique: true, fields: ["email"] }],
      sequelize: sequlize,
      modelName: "User",
      timestamps: true,
    }
  );
}

async function initDataUser() {
  const password = process.env.ADMIN_PASSWORD || "123456";
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = {
    email: "test@t.com",
    password: hash,
    firstname: "Admin",
    lastname: "Amin",
    role: "admin",
    active: true,
    remark: "",
  };

  await User.create(user);
}
