import { useDispatch } from "react-redux";
import { decrementQty, incrementQty } from "../store/cartSlice";

const CartProductCard = ({ item }) => {
    const dispatch = useDispatch();

    return (
        <div key={item.productId} className="flex justify-between gap-2 mb-5">
            <div className="w-[70%] flex justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <p className="text-xl">{item.product.name}</p>
                    <p className="font-bold">${item.product.price}</p>
                </div>
                {/* increament & decreament */}
                <div className="flex flex-col justify-between items-center text-xl">
                    <button
                        className="border-1 border-black w-8 h-8 cursor-pointer"
                        onClick={() => dispatch(incrementQty(item.productId))}
                        data-testid="cart-item-amount-increase"
                    >
                        +
                    </button>
                    <p data-testid="cart-item-amount">{item.quantity}</p>

                    <button
                        className="border-1 border-black w-8 h-8 cursor-pointer"
                        onClick={() => dispatch(decrementQty(item.productId))}
                        data-testid="cart-item-amount-decrease"
                    >
                        -
                    </button>
                </div>
            </div>
            {/* product image */}
            <div className="w-[30%]">
                <img src={item.product.images[0]} className="w-full" alt={item.product.name} />
            </div>
        </div>
    );
};

export default CartProductCard;
