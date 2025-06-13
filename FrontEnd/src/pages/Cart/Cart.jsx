import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/hooks';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const sampleProducts = [
    {
        id: 1,
        name: "Kurta Pajama Set",
        brand: "Traditional Threads",
        price: 2499,
        category: "clothing",
        gender: "men",
        description: "Elegant cotton Kurta Pajama set perfect for festivals and special occasions. Features intricate embroidery and comfortable fit.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["white", "beige", "navy"],
        stock: 50,
        rating: 4.8,
        reviews: 120,
        images: [
            "https://www.parivarceremony.com/media/catalog/product/cache/bd50db5b0865a3e949e91ec7dbded0bf/p/1/p1176mw06-1.jpg",
            "https://www.parivarceremony.com/media/catalog/product/cache/bd50db5b0865a3e949e91ec7dbded0bf/p/1/p1176mw06-2.jpg",
            "https://www.parivarceremony.com/media/catalog/product/cache/bd50db5b0865a3e949e91ec7dbded0bf/p/1/p1176mw06.jpg"
        ],
        isAccessory: false,
        quantity: 1
    },
    {
        id: 2,
        name: "Leather Bound Journal",
        brand: "Craftsman's Guild",
        price: 699,
        category: "stationery",
        description: "Handcrafted genuine leather journal with acid-free pages perfect for writing or sketching",
        stock: 35,
        rating: 4.6,
        reviews: 84,
        images: [
            "https://m.media-amazon.com/images/I/71Ve9OvW+AL._AC_UF894,1000_QL80_.jpg"
        ],
        quantity: 2
    },
    {
        id: 3,
        name: "Vintage Desk Lamp",
        brand: "Heritage Designs",
        price: 1899,
        category: "home decor",
        description: "Authentic brass desk lamp with adjustable arm and warm incandescent lighting",
        stock: 15,
        rating: 4.9,
        reviews: 42,
        images: [
            "https://m.media-amazon.com/images/I/61Wt2SOPuDL._AC_UF894,1000_QL80_.jpg"
        ],
        quantity: 1
    }
];

const Cart = () => {
    // Use sample products for demonstration instead of localStorage
    const [cartItems, setCartItems] = useState(sampleProducts);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        updateTotals(updatedCart);
    };

    const updateQuantity = (id, action) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = action === 'increase' 
                    ? item.quantity + 1 
                    : Math.max(1, item.quantity - 1);
                
                return {...item, quantity: newQuantity};
            }
            return item;
        });
        
        setCartItems(updatedCart);
        updateTotals(updatedCart);
    };

    const updateTotals = (items) => {
        const newTotalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(newTotalPrice);
        setTotalItems(items.reduce((sum, item) => sum + item.quantity, 0));
    };

    useEffect(() => {
        updateTotals(cartItems);
    }, [cartItems]);

    const formatPrice = (price) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/store" className="flex items-center text-black hover:text-gray-700 transition-colors">
                        <FaArrowLeft className="mr-2" />
                        <span className="text-lg">Continue Shopping</span>
                    </Link>
                    <h1 className="text-3xl font-bold dancing-script">Your Cart</h1>
                    <span className="text-lg font-medium">{totalItems} Items</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link 
                            to="/store" 
                            className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Explore Store
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                <div className="border-b border-gray-200 py-4 px-6 bg-gray-100">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-6">
                                            <h3 className="font-medium">Product</h3>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <h3 className="font-medium">Quantity</h3>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <h3 className="font-medium">Price</h3>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <h3 className="font-medium">Total</h3>
                                        </div>
                                    </div>
                                </div>
                                
                                {cartItems.map((item) => (
                                    <div key={item.id} className="border-b border-gray-200 py-4 px-6 hover:bg-gray-100 transition-colors">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-6">
                                                <div className="flex items-center">
                                                    <img 
                                                        src={item.images[0]} 
                                                        alt={item.name} 
                                                        className="w-20 h-20 object-cover rounded-md mr-4"
                                                    />
                                                    <div>
                                                        <h4 className="font-medium">{item.name}</h4>
                                                        <p className="text-sm text-gray-600">{item.brand}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex justify-center items-center">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 'decrease')}
                                                        className="p-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                                    >
                                                        <FaMinus className="text-xs" />
                                                    </button>
                                                    <span className="mx-2 w-8 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 'increase')}
                                                        className="p-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                                    >
                                                        <FaPlus className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <p>{formatPrice(item.price)}</p>
                                            </div>
                                            <div className="col-span-2 text-center relative">
                                                <p>{formatPrice(item.price * item.quantity)}</p>
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="absolute right-0 text-gray-500 hover:text-red-600 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                                <h3 className="text-xl font-medium mb-6 pb-4 border-b border-gray-200">Order Summary</h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>{formatPrice(totalPrice * 0.18)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between font-medium text-lg pt-4 border-t border-gray-200 mb-6">
                                    <span>Total</span>
                                    <span>{formatPrice(totalPrice + (totalPrice * 0.18))}</span>
                                </div>
                                
                                <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors mb-3">
                                    Proceed to Checkout
                                </button>
                                
                                <div className="text-center mt-4">
                                    <p className="text-sm text-gray-600">We accept:</p>
                                    <div className="flex justify-center space-x-2 mt-2">
                                        <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Visa</span>
                                        <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Mastercard</span>
                                        <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">PayPal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
