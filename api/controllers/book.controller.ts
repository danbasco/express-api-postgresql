import { Request, Response, NextFunction } from "express";
import { IBook } from "../models/Book.js";
import * as bookService from "../services/book.service.js"
import { InvalidIdError } from "../utils/errors.js";


export const createBook = async(req: Request<any, any, IBook> , res: Response, next: NextFunction) => {

    try {

        if(!req.user){
            return res.status(401).json( {message: "Unathorized."} );
        }

        const userId = Number(req.user.id);
        const book = await bookService.createBookService(req.body, userId);
        return res.status(book.status).json({ message: book.message});

    } catch (error) {
        next(error);
    }
    
}

export const listBooks = async(req: Request , res: Response, next: NextFunction) => {

    try {
        const user = { ...req.user, id: Number(req.user?.id) };
        const books = await bookService.listBooksService({ query: req.query, user });
        return res.status(books.status).json({ message: books.message, data: books.data });

    } catch (error) {
        next(error);
    }

}

export const listBookById = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const user = { ...req.user, id: Number(req.user?.id) };
        const book = await bookService.listBookByIdService({  id: req.params.id, user });
        return res.status(book.status).json({ message: book.message, data: book.data });

    } catch (error) {
        next(error);
    }

    }

export const updateBook = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const user = { ...req.user, id: Number(req.user?.id) };
        const book = await bookService.updateBookService({  id: req.params.id , user }, req.body);
        return res.status(book.status).json({ message: book.message, data: book.data });

    } catch (error) {
        next(error);
    }
}

export const patchBook = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const user = { ...req.user, id: Number(req.user?.id) };
        const book = await bookService.patchBookService({ id: req.params.id, user }, req.body);
        return res.status(book.status).json({ message: book.message, data: book.data });
        
    } catch (error) {
        next(error);
    }
}


export const deleteBook = async(req: Request, res: Response) => {

    const user = { ...req.user, id: Number(req.user?.id) };
    const book = await bookService.deleteBookService(req.params.id, user);
    return res.status(book.status).json({ message: book.message, data: book.data });

}