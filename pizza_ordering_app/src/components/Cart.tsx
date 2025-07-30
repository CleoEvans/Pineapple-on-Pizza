import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function Cart() {
  const cartItems = useQuery(api.cart.getCart);
  const updateCartItem = useMutation(api.cart.updateCartItem);
  const createOrder = useMutation(api.orders.createOrder);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const totalAmount = cartItems?.reduce((sum, item) => sum + item.price, 0) || 0;

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, currentPrice: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      await updateCartItem({
        itemId: itemId as any,
        quantity: 0,
        price: 0,
      });
      return;
    }

    const pricePerItem = currentPrice / currentQuantity;
    const newPrice = pricePerItem * newQuantity;

    await updateCartItem({
      itemId: itemId as any,
      quantity: newQuantity,
      price: newPrice,
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      await createOrder({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        cartItems: cartItems.map(item => ({
          pizzaId: item.pizzaId,
          pizzaName: item.pizzaName,
          size: item.size,
          toppings: item.toppings,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      });

      toast.success("Order placed successfully!");
      setShowCheckout(false);
      setCustomerInfo({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  if (!cartItems) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600">Add some delicious pizzas to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h2>
      
      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.pizzaName}</h3>
                <p className="text-gray-600 capitalize">Size: {item.size}</p>
                {item.toppings.length > 0 && (
                  <p className="text-gray-600">Toppings: {item.toppings.join(", ")}</p>
                )}
                <p className="text-lg font-bold text-red-600 mt-2">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpdateQuantity(item._id, item.quantity, item.price, -1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item._id, item.quantity, item.price, 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span>Total: ${totalAmount.toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Proceed to Checkout
        </button>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleCheckout} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Checkout</h3>
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-red-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
