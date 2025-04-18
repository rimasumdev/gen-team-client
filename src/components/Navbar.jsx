import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaBars,
  FaTimes,
  FaChartBar,
  FaList,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { GrHelpBook } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import Onboarding from "./Onboarding";

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
  const [showOnboarding, setShowOnboarding] = useState(false);

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
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
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

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                <FaUserCircle className="w-8 h-8 text-blue-500" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={() => {
                      setShowOnboarding(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <GrHelpBook className="w-4 h-4" />
                    <span>অনবোর্ডিং</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    <FaCog className="w-4 h-4" />
                    <span>সেটিংস</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>লগআউট</span>
                  </button>
                </div>
              )}

              {/* Onboarding Modal */}
              <Modal
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                title={
                  <div className="flex items-center gap-2">
                    <GrHelpBook className="text-blue-500" />
                    <span>অনবোর্ডিং</span>
                  </div>
                }
              >
                <Onboarding />
              </Modal>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-2 h-16 lg:hidden">
        <div className="flex justify-around items-center h-full">
          {menuItems.map((item) => (
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
