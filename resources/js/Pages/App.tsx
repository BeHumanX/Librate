import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import Modal from "../Components/Modal";

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    publisher: string;
    category_id: number;
    status: string;
}

interface Borrow {
    id: number;
    book_id: number;
    user_id: number;
    borrow_date: string;
    return_date: string;
    returned_at: string | null;
    book: Book;
}

const App: React.FC = () => {
    const [availableBooks, setAvailableBooks] = useState<Book[]>([]);   
    const [borrowedBooks, setBorrowedBooks] = useState<Borrow[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [returnDate, setReturnDate] = useState("");

    const fetchAvailableBooks = useCallback(async () => {
        try {
            const response = await axios.get<{ data: Book[] }>('/user/available-books');
            // Filter out duplicates based on id
            const uniqueBooks = response.data.data.filter((book, index, self) =>
                index === self.findIndex((t) => t.id === book.id)
            );
            setAvailableBooks(uniqueBooks);
        } catch (error) {
            console.error('Error fetching available books:', error);
            setAvailableBooks([]);
        }
    }, []);

    const fetchBorrowedBooks = useCallback(async () => {
        try {
            const response = await axios.get<Borrow[]>('/user/borrowed-books');
            setBorrowedBooks(response.data);
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
        }
    }, []);

    useEffect(() => {
        fetchAvailableBooks();
        fetchBorrowedBooks();
    }, [fetchAvailableBooks, fetchBorrowedBooks]);

    const handleBorrowBook = (bookId: number) => {
        setSelectedBookId(bookId);
        setIsModalOpen(true);
    };

    const confirmBorrow = async () => {
        if (!selectedBookId) return;

        try {
            const response = await axios.post<Borrow>('/borrows', { 
                book_id: selectedBookId,
                borrow_date: new Date().toISOString().split('T')[0], // Today's date
                return_date: returnDate
            });
            const newBorrow = response.data;
            setBorrowedBooks(prevBooks => [...prevBooks, newBorrow]);
            setAvailableBooks(prevBooks => prevBooks.filter(book => book.id !== selectedBookId));
            setIsModalOpen(false);
            setSelectedBookId(null);
            setReturnDate("");
        } catch (error) {   
            console.error('Error borrowing book:', error);
        }
    };

    return (
        <div className="bg-background p-4">
            <div className="flex">
                <div className="w-1/2 pr-4">
                    <h1 className="text-2xl font-bold mb-4 text-[#44475A]">Available Books</h1>
                    {Array.isArray(availableBooks) && availableBooks.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {availableBooks.map((book) => (
                                <li key={book.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-medium text-[#44475A]">{book.title}</span>
                                        <span className="text-sm text-gray-600">by {book.author}</span>
                                        <span className="text-sm text-gray-600">Year: {book.year}</span>
                                        <span className="text-sm text-gray-600">Publisher: {book.publisher}</span>
                                        <span className="text-sm text-gray-600">Category ID: {book.category_id}</span>
                                        <span className="text-sm text-gray-600">Status: {book.status}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleBorrowBook(book.id)}
                                        className="bg-primaryLight hover:bg-[#33374C] text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Borrow
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No available books found.</p>
                    )}
                </div>
                <div className="w-1/2 pl-4">
                    <h1 className="text-2xl font-bold mb-4 text-[#44475A]">Borrowed Books</h1>
                    <ul className="divide-y divide-gray-200">
                        {borrowedBooks.map((borrow) => (
                            <li key={borrow.id} className="px-4 py-4 sm:px-6">
                                <span className="text-lg font-medium text-[#44475A]">
                                    Book ID: {borrow.book_id}, Borrowed: {borrow.borrow_date}, Return: {borrow.return_date}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Borrow Book">
                <form onSubmit={(e) => { e.preventDefault(); confirmBorrow(); }} className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="returnDate">
                        Return Date
                    </label>
                    <input
                        type="date"
                        id="returnDate"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-[#33374C] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Confirm Borrow
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default App;
