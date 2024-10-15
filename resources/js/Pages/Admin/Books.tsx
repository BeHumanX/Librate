import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../Components/Modal";

interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    year: number;
    category_id: number;
    status: string;
}
interface BooksProps {
    books: Book[];
    categories: { id: number; name: string }[];
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
    onHandleBook: () => void;
}

const Books: React.FC<BooksProps> = ({ books, setBooks, onHandleBook, categories }) => {
    const [newBook, setNewBook] = useState<Book>({
        id: 0,
        title: "",
        author: "",
        publisher: "",
        year: 0,
        category_id: 0,
        status: "available",
    });
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("/books");
                setBooks(response.data.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/books", newBook);
            setBooks([...books, response.data]);
            setNewBook({ id: 0, title: "", author: "", publisher: "", year: 0, category_id: 0, status: "" });
            setIsModalOpen(false);
            onHandleBook();
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    const handleEditBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBook) return;
        try {
            const bookToUpdate = {
                ...editingBook,
                year: parseInt(editingBook.year.toString()),  // Ensure year is a number
                category_id: parseInt(editingBook.category_id.toString()),  // Ensure category is a number
                status: editingBook.status,
            };
            const response = await axios.put(`/books/${bookToUpdate.id}`, bookToUpdate);
            setBooks(books.map(book => book.id === bookToUpdate.id ? response.data : book));
            setEditingBook(null);
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    const handleDeleteBook = async (id: number) => {
        try {
            await axios.delete(`/books/${id}`);
            setBooks(books.filter(book => book.id !== id));
            onHandleBook();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full sm:max-w-[1000px]">
            <div className="rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-default">Books</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-[#33374C] text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        add book
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Book"
            >
                <form onSubmit={handleAddBook} className="mb-8">
                    <input
                        type="text"
                        value={newBook.title}
                        onChange={(e) =>
                            setNewBook({ ...newBook, title: e.target.value })
                        }
                        placeholder="Title"
                        className="bg-cardDark shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="text"
                        value={newBook.author}
                        onChange={(e) =>
                            setNewBook({ ...newBook, author: e.target.value })
                        }
                        placeholder="Author"
                        className="bg-cardDark shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="number"
                        value={newBook.year}
                        onChange={(e) =>
                            setNewBook({
                                ...newBook,
                                year: parseInt(e.target.value),
                            })
                        }
                        placeholder="Year"
                        className="bg-cardDark shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="text"
                        value={newBook.publisher}
                        onChange={(e) =>
                            setNewBook({ ...newBook, publisher: e.target.value })
                        }
                        placeholder="Publisher"
                        className="bg-cardDark shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <select
                        value={newBook.category_id || ''}  // Add a default empty string
                        onChange={(e) =>
                            setNewBook({
                                ...newBook,
                                category_id: e.target.value ? parseInt(e.target.value) : 0,  // Ensure it's a number or 0
                            })
                        }
                        className="bg-cardDark shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Category</option>
                        {categories && categories.map((category: { id: number; name: string }) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="bg-primary hover:bg-default text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            add book
                        </button>   
                    </div>
                </form>
            </Modal>
            <table className="min-w-full divide-y divide-gray-200">
                <thead >
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200">
                    {Array.isArray(books) && books.length > 0 ? (
                        books.map((book) => (
                            <tr key={book.id}>
                                {editingBook && editingBook.id === book.id ? (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={editingBook.title}
                                                onChange={(e) =>
                                                    setEditingBook({
                                                        ...editingBook,
                                                        title: e.target.value,
                                                    })
                                                }
                                                className="bg-cardDark appearance-none border rounded py-2 px-3 text-default leading-tight w-full"
                                                placeholder="Title"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={editingBook.author}
                                                onChange={(e) =>
                                                    setEditingBook({
                                                        ...editingBook,
                                                        author: e.target.value,
                                                    })
                                                }
                                                className="bg-cardDark appearance-none border rounded py-2 px-3 text-default leading-tight w-full"
                                                placeholder="Author"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={editingBook.year}
                                                onChange={(e) =>
                                                    setEditingBook({
                                                        ...editingBook,
                                                        year: parseInt(e.target.value),
                                                    })
                                                }
                                                className="bg-cardDark appearance-none border rounded py-2 px-3 text-default leading-tight w-full"
                                                placeholder="Year"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={editingBook.category_id || ''}
                                                onChange={(e) =>
                                                    setEditingBook({
                                                        ...editingBook,
                                                        category_id: e.target.value ? parseInt(e.target.value) : 0,
                                                    })
                                                }
                                                className="bg-cardDark appearance-none border rounded py-2 px-3 text-default leading-tight w-full"
                                            >
                                                <option value="">Select Category</option>
                                                {categories && categories.map((category: { id: number; name: string }) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={editingBook.publisher}
                                                onChange={(e) =>
                                                    setEditingBook({
                                                        ...editingBook,
                                                        publisher: e.target.value,
                                                    })
                                                }
                                                className="bg-cardDark appearance-none border rounded py-2 px-3 text-default leading-tight w-full"
                                                placeholder="Publisher"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={handleEditBook} className="bg-default hover:bg-primaryLight text-white font-bold py-1 px-2 rounded">
                                                Save
                                            </button>
                                            <button onClick={() => setEditingBook(null)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded ml-2">
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-default">{book.title}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-default">{book.author}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-default">{book.year}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-default">
                                                {categories.find(cat => cat.id === book.category_id)?.name || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-default">{book.publisher}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-default">{book.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => setEditingBook(book)} className="bg-primaryLight hover:bg-[#33374C] text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteBook(book.id)} className="bg-red-800 hover:bg-[#33374C] text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2">
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center">
                                No books available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Books;
