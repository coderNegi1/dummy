import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../utility/auth/authSlice';


export default function Navbar({ links }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showUserDropdown) return;
    function handleClick(e) {
      if (!e.target.closest('.user-dropdown')) setShowUserDropdown(false);
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [showUserDropdown]);

  // NavLink active class helper
  const getNavLinkClass = (isActive) => {
    if (isScrolled) {
      return isActive
        ? 'text-green-700 border-green-500'
        : 'text-gray-700 hover:text-green-700 border-transparent hover:border-green-400';
    } else {
      return isActive
        ? 'text-white border-green-200'
        : 'text-green-100 hover:text-white border-transparent hover:border-green-200';
    }
  };

  // Mobile nav item class
  const mobileNavItemClass = (isActive) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
      ? 'bg-green-100 text-green-700'
      : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
    }`;

  // Auth button click
  const handleAuth = () => {
    if (user) {
      setShowUserDropdown((prev) => !prev);
    } else {
      navigate('/signin');
    }
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`px-4 lg:fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-[120px]">
            <img
              src="/trendikala_logo_bg.png"
              alt="Trendi Kala Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden md:block border-l-2 border-green-700 h-10 mx-3" />
          <div className="hidden md:block">
            <span className="block text-green-700 font-semibold text-sm tracking-[.6rem]">
              TRENDI <br /> KALA
            </span>
            <span className="block text-[10px] text-gray-500 mt-1">
              TRENDS & KALA IN <br /> EVERY STICH
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:ps-44 md:flex space-x-10 lg:space-x-6 text-base font-medium">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors border-b-2 ${getNavLinkClass(isActive)}`
                }
              >
                {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div
          className={`flex items-center space-x-4 transition-colors duration-300 ${isScrolled ? 'text-green-700' : 'lg:text-white'
            }`}
        >
          <NavLink to="/cart">
            <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-green-500 transition" />
          </NavLink>
          {user && (
            <NavLink to="/wishlist">
              <Heart className="w-6 h-6 cursor-pointer hover:text-green-500 transition" />
            </NavLink>
          )}

          <Search
            className="w-6 h-6 cursor-pointer hover:text-green-500 transition"
            onClick={() => setIsSearchInputOpen(!isSearchInputOpen)}
          />

          {/* User/Login Button with Dropdown */}
          <div className="relative user-dropdown hidden md:block">
            {user ? (
              <button
                onClick={handleAuth}
                className="flex items-center hover:text-green-500 focus:outline-none"
              >
                <User className="w-6 h-6 cursor-pointer transition" />
                <span className="ml-1 text-sm">{user.name}</span>
                <svg
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleAuth}
                className="flex items-center hover:text-green-500"
              >
                <User className="w-6 h-6 cursor-pointer transition" />
                <span className="ml-1 text-sm">Login</span>
              </button>
            )}

            {/* Dropdown */}
            {user && showUserDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowUserDropdown(false);
                  }}
                  className="block text-green-500 w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block text-green-500 w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X
                className={`w-6 h-6 ${isScrolled ? 'text-green-700' : 'lg:text-white,text-green-700'
                  }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${isScrolled ? 'text-green-700' : 'lg:text-white,text-green-700'
                  }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white border-t border-gray-200 shadow-sm text-gree">
          <ul className="flex flex-col space-y-2 px-4 py-3">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => mobileNavItemClass(isActive)}
                >
                  {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                </NavLink>
              </li>
            ))}
            {/* User/Login for mobile */}
            <li>
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700 cursor-pointer"
                  >
                    <User className="w-6 h-6 mr-2" />
                    {user.name}
                    <svg
                      className="w-4 h-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {showUserDropdown && (
                    <div className="bg-white border rounded shadow-lg mt-1 absolute right-0 w-full z-50">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserDropdown(false);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/signin');
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700 cursor-pointer"
                >
                  <User className="w-6 h-6 mr-2" />
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* Search Input */}
      {isSearchInputOpen && (
        <div className="px-4 mt-3 pb-2">
          <input
            type="text"
            placeholder="Search products, stories..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 shadow"
          />
        </div>
      )}
    </nav>
  );
}
