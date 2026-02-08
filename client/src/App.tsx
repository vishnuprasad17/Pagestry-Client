import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthProvider";
import Loading from "./components/Loading";

import { useEffect, useState } from "react";
import CartSync from "./components/CartSync";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AuthProvider>
        <CartSync />
        <ScrollToTop />
        <Navbar />

        <main className="min-h-screen font-primary">
          {loading ? <Loading /> : <Outlet />}
        </main>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;