import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '@/components/AdminLayout';
import { getError } from '@/utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, categories: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

export default function AdminCategoriesScreen() {
  const router = useRouter();
  const [{ loading, error, categories, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    categories: [],
    error: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '📦',
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    image: '',
    description: '',
    isActive: true,
    order: 0,
  });

  const gradientOptions = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-yellow-500 to-orange-500',
    'from-teal-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-red-500 to-orange-500',
  ];

  const bgColorOptions = [
    'bg-blue-50 dark:bg-blue-900/20',
    'bg-purple-50 dark:bg-purple-900/20',
    'bg-green-50 dark:bg-green-900/20',
    'bg-orange-50 dark:bg-orange-900/20',
    'bg-indigo-50 dark:bg-indigo-900/20',
    'bg-yellow-50 dark:bg-yellow-900/20',
    'bg-teal-50 dark:bg-teal-900/20',
    'bg-violet-50 dark:bg-violet-900/20',
    'bg-pink-50 dark:bg-pink-900/20',
    'bg-red-50 dark:bg-red-900/20',
  ];

  const iconOptions = ['📦', '💻', '👕', '👟', '🎧', '📚', '🎮', '⚽', '🏠', '💄', '🍔', '📱', '⌚', '🎨', '🔧', '🎵'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/categories`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/categories/${categoryId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Category deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        gradient: category.gradient,
        bgColor: category.bgColor,
        image: category.image || '',
        description: category.description || '',
        isActive: category.isActive,
        order: category.order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        icon: '📦',
        gradient: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        image: '',
        description: '',
        isActive: true,
        order: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/admin/categories/${editingCategory._id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await axios.post('/api/admin/categories', formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      dispatch({ type: 'DELETE_RESET' });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }));
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="md:col-span-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Categories</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Category
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Order</th>
                  <th className="px-5 text-left">Icon</th>
                  <th className="px-5 text-left">Name</th>
                  <th className="px-5 text-left">Slug</th>
                  <th className="px-5 text-left">Products</th>
                  <th className="px-5 text-left">Status</th>
                  <th className="px-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b">
                    <td className="p-5">{category.order}</td>
                    <td className="p-5">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl`}>
                        {category.icon}
                      </div>
                    </td>
                    <td className="p-5">{category.name}</td>
                    <td className="p-5">{category.slug}</td>
                    <td className="p-5">{category.productCount || 0}</td>
                    <td className="p-5">
                      <span className={`px-2 py-1 rounded text-sm ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => openModal(category)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHandler(category._id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loadingDelete}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon} {icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Gradient</label>
                  <select
                    name="gradient"
                    value={formData.gradient}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    {gradientOptions.map(gradient => (
                      <option key={gradient} value={gradient}>{gradient}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Background Color</label>
                  <select
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    {bgColorOptions.map(bgColor => (
                      <option key={bgColor} value={bgColor}>{bgColor}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2">Image URL (optional)</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

AdminCategoriesScreen.auth = { adminOnly: true };
