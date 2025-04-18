import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaBars,
  FaTimes,
  FaChartBar,
  FaList,
  FaUserCircle,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useState, useEffect } from "react";

const NavLink = ({ to, icon, text, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`}
  >
    <span className={`${isActive ? "text-white" : "text-blue-500"}`}>
      {icon}
    </span>
    <span>{text}</span>
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { to: "/", icon: <MdDashboard />, text: "ড্যাশবোর্ড" },
    { to: "/players", icon: <FaChartBar />, text: "খেলোয়াড়দের তালিকা" },
    { to: "/team-generator", icon: <FaUsers />, text: "টিম তৈরি করুন" },
    { to: "/teams", icon: <FaList />, text: "তৈরি করা টিমসমূহ" },
  ];
  const mobileMenuItems = [
    { to: "/", icon: <MdDashboard />, text: "ড্যাশবোর্ড" },
    { to: "/players", icon: <FaChartBar />, text: "তালিকা" },
    { to: "/team-generator", icon: <FaUsers />, text: "টিম তৈরি" },
    { to: "/teams", icon: <FaList />, text: "টিমসমূহ" },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
            >
              <FaUsers className="w-6 h-6 text-blue-500" />
              <span className="hidden sm:inline">ফুটবল টিম ম্যানেজার</span>
              <span className="sm:hidden">টিম ম্যানেজার</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  {...item}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            {/* <FaUserCircle size={40} /> */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden rounded-lg  hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <FaUserCircle size={40} />
              {/* {isMenuOpen ? <FaTimes size={20} /> : <FaUserCircle size={40} />} */}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-2 h-16 lg:hidden">
        <div className="flex justify-around items-center h-full">
          {mobileMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center h-full text-sm font-medium transition-all duration-200 ${
                location.pathname === item.to
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
