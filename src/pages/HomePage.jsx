import { useState, useEffect } from 'react';
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

// Backend API URL
const API_URL = 'http://localhost:3099/api/products';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Function to retry API call
    const retryFetch = () => {
        setLoading(true);
        setError(null);
        setDebugInfo('Retrying API call...');
        
        // Trigger the fetch again by forcing a re-render
        setProducts([]);
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
                    <div className="flex justify-between items-center mb-5">
                        <h1 className="text-4xl">ALL PRODUCTS</h1>
                        {debugInfo && <span className="text-sm text-gray-500">{debugInfo}</span>}
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner loading={loading} />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center">
                            <p className="text-xl mb-4">No products available</p>
                            <button 
                                onClick={retryFetch}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {products.map((product) => (
                                    <ProductCard product={product} key={product.id} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default HomePage;
