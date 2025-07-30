import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const SIZES = {
  small: { name: "Small (10\")", multiplier: 1 },
  medium: { name: "Medium (12\")", multiplier: 1.3 },
  large: { name: "Large (14\")", multiplier: 1.6 },
};

const TOPPINGS = [
  "Extra Cheese", "Pepperoni", "Mushrooms", "Bell Peppers", 
  "Onions", "Sausage", "Ham", "Bacon", "Olives", "Tomatoes"
];

export function PizzaMenu() {
  const pizzas = useQuery(api.pizzas.list);
  const seedPizzas = useMutation(api.pizzas.seedPizzas);
  const addToCart = useMutation(api.cart.addToCart);
  const [selectedPizza, setSelectedPizza] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<keyof typeof SIZES>("medium");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (pizzas && pizzas.length === 0) {
      seedPizzas();
    }
  }, [pizzas, seedPizzas]);

  const calculatePrice = (basePrice: number) => {
    const sizeMultiplier = SIZES[selectedSize].multiplier;
    const toppingsPrice = selectedToppings.length * 1.5;
    return ((basePrice * sizeMultiplier) + toppingsPrice) * quantity;
  };

  const handleAddToCart = async () => {
    if (!selectedPizza) return;

    try {
      await addToCart({
        pizzaId: selectedPizza._id,
        pizzaName: selectedPizza.name,
        size: selectedSize,
        toppings: selectedToppings,
        quantity,
        price: calculatePrice(selectedPizza.basePrice),
      });
      
      toast.success("Added to cart!");
      setSelectedPizza(null);
      setSelectedToppings([]);
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const toggleTopping = (topping: string) => {
    setSelectedToppings(prev => 
      prev.includes(topping) 
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  if (!pizzas) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <div key={pizza._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="text-4xl mb-4 text-center">{pizza.image}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pizza.name}</h3>
              <p className="text-gray-600 mb-4">{pizza.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-red-600">
                  From ${pizza.basePrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {pizza.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedPizza(pizza)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Customize & Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPizza && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedPizza.name}</h3>
                <button
                  onClick={() => setSelectedPizza(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-6">{selectedPizza.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Size</h4>
                <div className="space-y-2">
                  {Object.entries(SIZES).map(([size, info]) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={selectedSize === size}
                        onChange={(e) => setSelectedSize(e.target.value as keyof typeof SIZES)}
                        className="mr-3"
                      />
                      <span className="flex-1">{info.name}</span>
                      <span className="font-medium">
                        ${(selectedPizza.basePrice * info.multiplier).toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toppings */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Extra Toppings (+$1.50 each)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {TOPPINGS.map((topping) => (
                    <label key={topping} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping)}
                        onChange={() => toggleTopping(topping)}
                        className="mr-2"
                      />
                      {topping}
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Quantity</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total and Add to Cart */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-red-600">
                    ${calculatePrice(selectedPizza.basePrice).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
