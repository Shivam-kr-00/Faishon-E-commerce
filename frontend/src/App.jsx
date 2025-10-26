import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import FeaturedCollectionPage from "./pages/FeaturedCollectionPage";
import OffersPage from "./pages/OffersPage";
import OrdersPage from "./pages/OrdersPage";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  useEffect(() => {
    // On app load, verify if the user is authenticated
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Fetch cart items when the user logs in
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);
  const location = useLocation();

  // Footer is hidden on auth pages
  const hideFooter =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  if (checkingAuth) return <LoadingSpinner />;
  return (
    // The main container establishes the positioning context with `relative`
    <div className="min-h-screen text-white relative">
      <div className="absolute inset-0 -z-10 bg-[#0d2e29] bg-[radial-gradient(circle_at_center,#15423b,#0d2e29_70%)]" />

      {/* Your shared Navbar appears on all pages */}
      <Navbar />

      {/* Your page content will be rendered here based on the URL */}
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/secret-dashboard"
            element={
              user?.role == "admin" ? <AdminPage /> : <Navigate to="/login" />
            }
          />

          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
          />
          <Route path="/collections/new" element={<NewArrivalsPage />} />
          <Route
            path="/collections/featured"
            element={<FeaturedCollectionPage />}
          />
          <Route path="/offers" element={<OffersPage />} />
          <Route
            path="/orders"
            element={user ? <OrdersPage /> : <Navigate to="/login" />}
          />
        </Routes>
        <Toaster />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
