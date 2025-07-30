import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS = {
  pending: "Order Received",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function Orders() {
  const orders = useQuery(api.orders.getUserOrders);

  if (!orders) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600">Your order history will appear here once you place your first order.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order._id.slice(-8)}
                </h3>
                <p className="text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString()} at{" "}
                  {new Date(order.orderDate).toLocaleTimeString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]
                }`}
              >
                {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS]}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.pizzaName}</span>
                      <span className="text-gray-600 ml-2 capitalize">({item.size})</span>
                      {item.toppings.length > 0 && (
                        <div className="text-sm text-gray-500">
                          + {item.toppings.join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-red-600">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Address:</h4>
              <p className="text-gray-600">{order.customerAddress}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
