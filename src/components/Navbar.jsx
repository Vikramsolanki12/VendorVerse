import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + App Name */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dfolw8zvb/image/upload/v1753632974/ChatGPT_Image_Jul_27_2025_09_39_51_PM_lrfqqy.png"
            alt="VendorVerse"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-emerald-600">VendorVerse</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
          <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
          <Link to="/vendor" className="hover:text-emerald-600 transition">Vendor</Link>
          <Link to="/supplier-login" className="hover:text-emerald-600 transition">Supplier</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-2 pb-4 text-slate-700 font-medium">
          <Link to="/" className="block hover:text-emerald-600">Home</Link>
          <Link to="/vendor" className="block hover:text-emerald-600">Vendor</Link>
          <Link to="/supplier-login" className="block hover:text-emerald-600">Supplier</Link>
        </div>
      )}
    </nav>
  );
}
