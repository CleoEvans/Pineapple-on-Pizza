import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { PizzaMenu } from "./components/PizzaMenu";
import { Cart } from "./components/Cart";
import { Orders } from "./components/Orders";
import { useState } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState<"menu" | "cart" | "orders">("menu");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-red-600">🍕 Tony's Pizza</h1>
            <Authenticated>
              <nav className="flex gap-4">
                <button
                  onClick={() => setCurrentView("menu")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "menu"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  Menu
                </button>
                <button
                  onClick={() => setCurrentView("cart")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "cart"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  Cart
                </button>
                <button
                  onClick={() => setCurrentView("orders")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "orders"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  My Orders
                </button>
              </nav>
            </Authenticated>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">
        <Content currentView={currentView} />
      </main>
      <Toaster />
    </div>
  );
}

function Content({ currentView }: { currentView: "menu" | "cart" | "orders" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Tony's Pizza</h2>
            <p className="text-xl text-gray-600">Sign in to start ordering delicious pizzas!</p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {loggedInUser?.email?.split("@")[0] || "friend"}!
          </h2>
          <p className="text-gray-600">Ready to order some delicious pizza?</p>
        </div>

        {currentView === "menu" && <PizzaMenu />}
        {currentView === "cart" && <Cart />}
        {currentView === "orders" && <Orders />}
      </Authenticated>
    </div>
  );
}
