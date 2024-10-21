import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, BrowserRouter, Link, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../../../public/src2/common/Loader/index";
import axios from "axios";

interface Category {
    id: number;
    name: string;
}

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
    user_id: number;
    book_id: number;
    borrow_date: string;
    return_date: string;
}

interface DashboardData {
    book_count: number;
    category_count: number;
    borrow_count: number;
}
const Categories = lazy(() => import("./Admin/Categories"));
const Books = lazy(() => import("./Admin/Books"));
const Borrow = lazy(() => import("./Admin/Borrow"));
const Admin: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen(prev => !prev);
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await axios.get('/admin/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        fetchDashboardData();
        return () => clearTimeout(timer);
    }, [fetchDashboardData]);

    if (loading) {
        return <Loader />;
    }

    return (
        <BrowserRouter>
            <div className="flex h-screen overflow-hidden">
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                    <main>
                        <div className="p-4">
                            <Suspense fallback={<Loader />}>
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard dashboardData={dashboardData} />} />
                                    <Route path="/admin/categories" element={
                                        <Categories 
                                            categories={categories} 
                                            setCategories={setCategories} 
                                            onHandleCategory={fetchDashboardData}
                                        />
                                    } />
                                    <Route path="/admin/books" element={<Books 
                                        books={books} 
                                        setBooks={setBooks} 
                                        onHandleBook={fetchDashboardData} 
                                        categories={categories} 
                                    />} />
                                    <Route path="/borrows" element={<Borrows />} />
                                </Routes>
                            </Suspense>
                        </div>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
};

interface HeaderProps {
    mobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
    return (
        <header className="sticky top-0 z-999 flex w-full bg-background drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between py-4 px-4 md:px-6 2xl:px-11">
                <nav className="hidden sm:block ml-auto">
                    <ul className="flex items-center gap-2 sm:gap-4 justify-end">
                        <li><Link to="/dashboard" className="text-sm font-medium text-cardDark hover:text-primary">Dashboard</Link></li>
                        <li><Link to="/admin/categories" className="text-sm font-medium text-cardDark hover:text-primary">Categories</Link></li>
                        <li><Link to="/admin/books" className="text-sm font-medium text-cardDark hover:text-primary">Books</Link></li>
                        <li><Link to="/admin/borrows" className="text-sm font-medium text-cardDark hover:text-primary">Borrows</Link></li>
                    </ul>
                </nav>

                {/* Mobile menu button */}
                <div className="sm:hidden relative ml-auto">
                    <button
                        className="p-2 text-gray-500 rounded-md hover:text-gray-600 focus:outline-none focus:ring sm:ml-auto"
                        onClick={toggleMobileMenu}
                    >
                        <span className="sr-only">Open menu</span>
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    {mobileMenuOpen && <MobileMenu />}
                </div>
            </div>
        </header>
    );
};

const MobileMenu: React.FC = () => (
    <div className="absolute right-0 mt-2 w-48 bg-[#D9D9D9] rounded-md shadow-lg py-1 z-10">
        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-primaryDark">Admin Dashboard</Link>
        <Link to="/admin/categories" className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-primaryDark">Categories</Link>
        <Link to="/admin/books" className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-primaryDark">Books</Link>
        <Link to="/admin/borrows" className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-primaryDark">Borrows</Link>
    </div>
);

interface DashboardCardProps {
    title: string;
    value: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
    return (
        <div className="bg-cardDark p-4 rounded-lg ">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-3xl text-default font-bold">{value}</p>
        </div>
    );
};

const Dashboard: React.FC<{ dashboardData: DashboardData | null }> = ({ dashboardData }) => (
    <div className="bg-background p-4">
        <h1 className="text-2xl font-bold text-cardDark mb-4">Admin Dashboard</h1>
        {dashboardData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardCard title="Total Books" value={dashboardData.book_count} />
                <DashboardCard title="Total Categories" value={dashboardData.category_count} />
                <DashboardCard title="Total Borrows" value={dashboardData.borrow_count} />
            </div>
        ) : (
            <p>Loading dashboard data...</p>
        )}
    </div>
);

const Borrows: React.FC = () => (
    <div className="bg-default p-4">
        <h1 className="text-2xl font-bold mb-4">Borrows Management</h1>
        <p>Here you can manage book borrowings.</p>
    </div>
);

export default Admin;
