import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductAttributes from "../components/ProductAttributes";
import { addToCart, openCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import Spinner from "../components/Spinner";

// Backend API URL
const API_URL = 'http://localhost:3099/api/products';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [debugInfo, setDebugInfo] = useState(null);
    
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProductDetails = async () => {
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
                console.log('Received data, looking for product ID:', productId);
                
                // Find the specific product
                const foundProduct = data.find(p => p.id === productId);
                
                if (!foundProduct) {
                    throw new Error('Product not found');
                }
                
                setProduct(foundProduct);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    const retryFetch = () => {
        setLoading(true);
        setError(null);
        
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }
                const data = await response.json();
                const foundProduct = data.find(p => p.id === productId);
                
                if (!foundProduct) {
                    throw new Error('Product not found');
                }
                
                setProduct(foundProduct);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchProductDetails();
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
        <section>
            <div className="container">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner loading={loading} />
                    </div>
                ) : (
                    <>
                        <section className="py-10">
                            <div className="container">
                                <div className="flex flex-col md:flex-row gap-10 justify-between">
                                    <div
                                        className="w-full md:w-[60%] flex flex-col md:flex-row justify-between gap-5"
                                        data-testid="product-gallery"
                                    >
                                        {/* image  */}
                                        <div className="w-full">
                                            <img 
                                                src={product.images[0]} 
                                                alt={product.name}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-[40%]">
                                        {/* name  */}
                                        <h1 className="text-4xl font-raleway font-semibold mb-5">
                                            {product.name}
                                        </h1>
                                        
                                        {/* price  */}
                                        <div>
                                            <h3 className="text-xl font-roboto font-semibold">
                                                Price:
                                            </h3>
                                            <p className="font-raleway text-2xl font-bold mb-5">
                                                ${product.price}
                                            </p>
                                        </div>
                                        {/* add to cart btn  */}
                                        {product.inStock && (
                                            <button
                                                className="px-6 py-3 rounded w-full uppercase bg-primary text-white hover:bg-[#6ed388] cursor-pointer"
                                                onClick={() => {
                                                    dispatch(
                                                        addToCart({
                                                            productId: product.id,
                                                            quantity: 1,
                                                            product: product,
                                                        })
                                                    );
                                                    dispatch(openCart());
                                                }}
                                                data-testid="add-to-cart"
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                        {/* description  */}
                                        <div
                                            className="font-roboto my-5"
                                            data-testid="product-description"
                                        >
                                            <p>{product.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </section>
    );
};

export default ProductDetailsPage;
