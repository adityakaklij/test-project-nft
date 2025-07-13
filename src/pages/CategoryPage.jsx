import { useState, useEffect } from 'react';
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

// Backend API URL
const API_URL = 'http://localhost:3099/api/products';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products from:', API_URL);
                const response = await fetch(API_URL);
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    setDebugInfo(`Status: ${response.status}, URL: ${response.url}`);
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Received data:', data);
                
                // Filter products by category
                const filteredProducts = categoryId === 'all' 
                    ? data 
                    : data.filter(product => product.category === categoryId);
                
                setProducts(filteredProducts);
                setCategoryName(categoryId.toUpperCase());
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const retryFetch = () => {
        setLoading(true);
        setError(null);
        setProducts([]);
        
        const fetchProducts = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }
                const data = await response.json();
                const filteredProducts = categoryId === 'all' 
                    ? data 
                    : data.filter(product => product.category === categoryId);
                
                setProducts(filteredProducts);
                setCategoryName(categoryId.toUpperCase());
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchProducts();
    };

    if (error) return (
        <div className="container py-10 text-center">
            <p className="text-red-500 text-xl">Error! {error}</p>
            {debugInfo && <p className="text-gray-500 mt-2">Debug info: {debugInfo}</p>}
            <button 
                onClick={retryFetch}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Retry
            </button>
        </div>
    );

    return (
        <>
            <section className="py-10">
                <div className="container">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner loading={loading} />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl mb-5 uppercase">
                                {categoryName}
                            </h1>
                            {products.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-xl mb-4">No products in this category</p>
                                    <button 
                                        onClick={retryFetch}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {products.map((product) => (
                                        <ProductCard product={product} key={product.id} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default CategoryPage;
