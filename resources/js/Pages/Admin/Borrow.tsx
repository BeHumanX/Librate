import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Borrow {
    id: number;
    user_id: number;
    book_id: number;
    borrow_date: string;
    return_date: string;
}

interface BorrowProps {
    borrows: Borrow[];
    setBorrows: React.Dispatch<React.SetStateAction<Borrow[]>>;
    books: {id: number; title:string}[];
}

const Borrow: React.FC<BorrowProps> = ({borrows, books, setBorrows}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBorrow = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/borrows");
        console.log("Fetched borrows:", response.data.data);
        setBorrows(response.data.data);
      } catch (error) {
        console.error("Error fetching borrows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBorrow();
  }, [setBorrows]);

  console.log("Current borrows state:", borrows);

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full sm:max-w-[1000px]'>
        <div className='rounded-lg overflow-hidden'>
          <div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-default'>Borrow</h1>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Book</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Borrow Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Return Date</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {borrows && borrows.length > 0 ? (
                  borrows.map((borrow) => (
                    <tr key={borrow.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>{borrow.user_id}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{books.find((book) => book.id === borrow.book_id)?.title || 'Unknown'}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{borrow.borrow_date}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{borrow.return_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className='text-center'>No data found</td></tr>
                )}
              </tbody>
            </table>
            {/* <div className='mt-4 flex justify-center'> 
              <button 
                onClick={() => handlePageChange('prev')} 
                disabled={currentPage === 1}
                className='bg-primaryLight hover:bg-[#33374C] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:opacity-50'
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange('next')} 
                disabled={borrows.length === 0}
                className='bg-primaryLight hover:bg-[#33374C] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 disabled:opacity-50'
              >
                Next
              </button>
            </div> */}
          </>
        )}
      </div>
    </>
  )
}

export default Borrow
