import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/cartSlice";
import CartProductCard from "./CartProductCard";
import Spinner from "./Spinner";
import { useState } from "react";

const CartOverlay = ({ isCartOpen }) => {
    const cart = useSelector((state) => state.cart.items);
    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    const handlePlaceOrder = () => {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            dispatch(clearCart());
            setLoading(false);
            setOrderComplete(true);
            
            // Reset the success message after 3 seconds
            setTimeout(() => {
                setOrderComplete(false);
            }, 3000);
        }, 1000);
    };

    return (
        <>
            <div
                className={`absolute px-4 py-6 top-[100%] right-[10%] shadow bg-white z-50 flex flex-col gap-4 w-[400px] ${
                    !isCartOpen && "hidden "
                }`}
                data-testid="cart-overlay"
            >
                <h3 className="font-raleway">
                    <span className="font-bold">My Bag,</span>{" "}
                    <span data-testid="cart-total">{totalItemsCount}</span>{" "}
                    {totalItemsCount === 1 ? "item" : "items"}
                </h3>
                {/* cart items */}
                <div className="max-h-[400px] overflow-auto">
                    {totalItemsCount === 0 && !orderComplete ? (
                        <p className="font-raleway text-gray-500">Cart is empty</p>
                    ) : orderComplete ? (
                        <p className="font-raleway text-green-500">Order placed successfully!</p>
                    ) : (
                        cart.map((item) => <CartProductCard key={item.productId} item={item} />)
                    )}
                </div>
                {/* total price  */}
                <div className="flex justify-between font-semibold">
                    <p>Total Price:</p>
                    <p>
                        $
                        {cart
                            .reduce(
                                (acc, item) => acc + item.product.price * item.quantity,
                                0
                            )
                            .toFixed(2)}
                    </p>
                </div>
                {/* place order btn  */}
                <button
                    disabled={totalItemsCount === 0 || loading}
                    className={`px-6 py-3 rounded w-full uppercase ${
                        totalItemsCount === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-[#6ed388] cursor-pointer"
                    }`}
                    onClick={handlePlaceOrder}
                >
                    {loading ? <Spinner loading={loading} color="#fff" size={20} /> : "Place order"}
                </button>
            </div>
        </>
    );
};

export default CartOverlay;
