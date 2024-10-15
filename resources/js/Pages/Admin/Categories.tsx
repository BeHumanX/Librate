import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../Components/Modal';

interface Category {
    id: number;
    name: string;
}

interface CategoriesProps {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    onHandleCategory: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, setCategories, onHandleCategory }) => {
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/categories', { name: newCategoryName });
            setNewCategoryName('');
            fetchCategories();
            setIsModalOpen(false);
            onHandleCategory(); // Call this function after successfully adding a category
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        try {
            await axios.put(`/categories/${editingCategory.id}`, { name: editingCategory.name });
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await axios.delete(`/categories/${id}`);
            fetchCategories();
            onHandleCategory();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full sm:max-w-[600px]">
            <div className="rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-default">Categories</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-[#33374C] text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        add category
                    </button>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
                    <form onSubmit={handleAddCategory} className="mb-4">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name"
                            className="bg-cardDark shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                add category
                            </button>
                        </div>
                    </form>
                </Modal>

                <ul className="divide-y divide-gray-200">
                    {categories.map((category) => (
                        <li key={category.id} className="px-4 py-4 sm:px-6">
                            {editingCategory && editingCategory.id === category.id ? (
                                <form onSubmit={handleEditCategory} className="flex items-center">
                                    <input
                                        type="text"
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                        className="bg-cardDark  appearance-none border rounded py-2 px-3 text-default leading-tight focus:outline-none focus:shadow-outline mr-2 flex-grow"
                                    />
                                    <button type="submit" className="bg-default hover:bg-primaryLight text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2">save</button>
                                    <button onClick={() => setEditingCategory(null)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">cancel</button>
                                </form>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-[#44475A]">{category.name}</span>
                                    <div>
                                        <button onClick={() => setEditingCategory(category)} className="bg-primaryLight hover:bg-[#33374C] text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2">Edit</button>
                                        <button onClick={() => handleDeleteCategory(category.id)} className="bg-red-800 hover:bg-[#33374C] text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Categories;
