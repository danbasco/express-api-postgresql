import { GENRES, Genre } from "../types/genres.type.js";
import { STATUS, Status } from "../types/status.type.js";


export interface IBook {
    "title": string,
    "author": string,
    "description": string,
    "genre": Genre[],
    "status": Status,
    "userId": number
}



export default (sequelize: any, Sequelize: any) => {
    const Book = sequelize.define("book", {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        genre: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });

    Book.associate = (models: any) => {
        
        Book.belongsTo(models.User || models.user, { foreignKey: 'userId', as: 'user' });
    };

    return Book;
};