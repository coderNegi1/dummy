import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../utility/auth/authSlice';

export default function Navbar({ links }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-dropdown')) setShowDropdown(false);
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="px-4 top-0 left-0 right-0 z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-0">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-[80px]">
            <img src="/trendikala_logo_bg.png" alt="Trendi Kala Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden md:block border-l-2 border-green-700 h-10 mx-3" />
          <div className="hidden md:block">
            <span className="block text-green-700 font-semibold text-sm tracking-[.4rem]">TRENDI KALA</span>
            <span className="block text-[10px] text-gray-500 mt-1">TRENDS & KALA IN EVERY STICH</span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:ps-44 md:flex space-x-10 lg:space-x-14 text-base font-medium">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors border-b-2 ${isActive
                    ? 'text-green-700 border-green-500'
                    : 'text-gray-700 hover:text-green-700 border-transparent hover:border-green-400'}`
                }
              >
                {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center space-x-4 text-green-700">
          {user && (<NavLink to="/cart"><ShoppingCart className="w-6 h-6 hover:text-green-500 transition" /></NavLink>
          )}
          {user && (
            <NavLink to="/wishlist">
              <Heart className="w-6 h-6 cursor-pointer hover:text-green-500 transition" />
            </NavLink>
          )}
          <Search className="w-6 h-6 hover:text-green-500 transition" onClick={() => setIsSearchInputOpen(!isSearchInputOpen)} />

          {/* User Icon with Dropdown */}
          <div className="relative user-dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1 hover:text-green-500">
              <User className="w-6 h-6" />
              {user ? <span className="text-sm hidden md:inline">{user.name}</span> : <span className="text-sm hidden md:inline">Login</span>}
              <svg className="w-4 h-4 hidden md:inline" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* ✅ Reusable Dropdown (visible on both mobile & desktop) */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                {user ? (
                  <>
                    <button onClick={handleProfileClick} className="w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/signin');
                      setShowDropdown(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Links */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white border-t border-gray-200 shadow-sm">
          <ul className="flex flex-col space-y-2 px-4 py-3">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'}`
                  }
                >
                  {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                </NavLink>
              </li>
            ))}
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
