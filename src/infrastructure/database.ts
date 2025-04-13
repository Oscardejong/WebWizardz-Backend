import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Webwizardz", "postgres", "Maandag#1", {
    host: "localhost",
    dialect: "postgres", 
    logging: console.log, 
});

export default sequelize;