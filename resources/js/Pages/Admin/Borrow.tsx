import React,{useState,useEffect} from 'react'
import axios from 'axios'

interface Borrow {
    id: number;
    user_id: number;
    book_id: number;
    borrow_date: string;
    return_date: string;
}

interface BorrowProps {
    borrow: Borrow[];
    user: {id: number; name:string}[];
    book: {id: number; title:string}[];
}

const Borrow: React.FC<BorrowProps> = ({borrow,user,book}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [borrows,setBorrows] = useState<Borrow[]>([]);
  useEffect(() => {
    const fetchBorrow = async () => {
      const response = await axios.get("/borrow");
      setBorrows(response.data.data);
    };
    fetchBorrow();
  }, []);
  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    setCurrentPage(newPage);
  };
    return (
        <>
            
        </>
  )
}

export default Borrow