import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Starfield from "./components/Starfield";
import Discover from "./pages/Discover";
import Stellarium from "./pages/Stellarium";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen relative">
      <Starfield />
      <Navbar />
      <main className="pt-20 pb-25 max-w-7xl mx-auto relative">
        <Routes>
          <Route path="/" element={<Discover key={localStorage.getItem("astroUser") ? "logged" : "loggedOut"}/> } />
          <Route path="/stellarium" element={<Stellarium />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
