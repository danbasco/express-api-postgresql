import Book, { IBook } from "../models/Book.js";
import db from "../models/index.js";
import ResponseType from "../types/response.type.js";
import { normalizeGenres, validateParams, validatePatchParams } from "../utils/validators.js";
import { Op } from "sequelize";
const locateBook = async(id?: string, filters: any = {}) : Promise<(any[])> => {
    
    const where: any = { ...filters };

    if (id) {
        const bookId = Number(id);
        if (isNaN(bookId)) return [];
        const book = await db.books.findOne({ where: { ...where, id: bookId } });
        return book ? [book] : [];
    }

    const books = await db.books.findAll({ where });
    return books;

}


export const createBookService = async (data: IBook, userId: string | number) : Promise<ResponseType> => {

    try{
    
        const numericUserId = Number(userId);
        if (isNaN(numericUserId)) {
            return { status: 400, message: "Invalid user id." };
        }

        // opcional: checar se o user existe para evitar violação de FK
        const UsersModel = (db.users || db.User || db.Users);
        if (UsersModel) {
            const userExists = await UsersModel.findByPk(numericUserId);
            if (!userExists) {
                return { status: 404, message: "User not found." };
            }
        }

        await validateParams(data);
        const genres = normalizeGenres(data.genre);

        const book = await db.books.create({

            title: data.title,
            author: data.author, 
            description: data.description || data.title, // if case of empty description
            genre: genres,
            status: data.status,
            userId: numericUserId, 

        })

        return {status: 201, message: "Book created on database sucessfully.", data: {id: book.id}};

    }catch(error: any) {

        console.error("createBookService error:", error);
        throw error;
    }
}

export const listBooksService = async(req: any) : Promise<ResponseType> => {
    
    try {

        const { query, user }  = req;
        const where: any = { userId: Number(user.id) };

        if (query.title) where.title = { [Op.iLike]: `%${query.title}%` };
        if (query.author) where.author = { [Op.iLike]: `%${query.author}%` };
        if (query.genre) where.genre = { [Op.contains]: [query.genre] }; // coluna ARRAY
        if (query.status) where.status = { [Op.iLike]: query.status };

        const books = await locateBook(undefined, where);

        if (books.length === 0) {
            return {status: 404, message: "No books found."};
        }

        return {status: 200, message: "Books retrieved successfully.", data: books};

    } catch (error: any) {

        console.error("listBooksService error:", error);
        throw error;

    }
}

export const listBookByIdService = async(req: {id: string, user: any}) : Promise<ResponseType> => {

    try {

        const { id, user } = req;
        const filters : any = { userId: Number(user.id) };

        const books = await locateBook(id, filters);
        if (books.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        return {status: 200, message: "Book retrieved successfully.", data: books[0]};

    } catch (error: any) {
        console.error("listBookByIdService error:", error);
        throw error;
    }

}

export const updateBookService = async(req: {id: string, user: any}, data: IBook) : Promise<ResponseType> => {
    
    try {

        const { id, user } = req;
        const filters : any = { userId: Number(user.id) };

        const books = await locateBook(id, filters);
        if (books.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        await validateParams(data);

        const book = books[0];
        await book.update({
            title: data.title,
            author: data.author,
            description: data.description,
            genre: normalizeGenres(data.genre),
            status: data.status
        });

        return {status: 200, message: "Book updated successfully.", data: book};
    } catch (error: any) {


        console.error("updateBookService error:", error);
        throw error;
    }
}

export const patchBookService = async(req: {id: string, user: any}, data: Partial<IBook>) : Promise<ResponseType> => {
    
    try {
    const { id, user } = req;
        const filters : any = { userId: Number(user.id) };

        const books = await locateBook(id, filters);
        if (books.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        if(!data || Object.keys(data).length === 0) {
            return {status: 400, message: "No data provided for update."};
        }

        const validData = await validatePatchParams(data);
        if (validData.genre) validData.genre = normalizeGenres(validData.genre as any);

        const book = books[0];
        await book.update(validData);

        return {status: 200, message: "Book patched successfully.", data: book};

    } catch (error: any) {

        console.error("patchBookService error:", error);
        throw error;
    }
}

export const deleteBookService = async(id: string, user: any) : Promise<ResponseType> => {
    try {
        const filters : any = { userId: Number(user.id) };

        const books = await locateBook(id, filters);
        if (books.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        const book = books[0];
        await db.books.destroy({ where: { id: book.id } });

        return {status: 200, message: "Book deleted successfully."};

    } catch (error: any) {
        console.error("deleteBookService error:", error);
        throw error;
    }
}