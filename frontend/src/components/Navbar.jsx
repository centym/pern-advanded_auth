import { Link, useResolvedPath } from "react-router-dom";
//import { useState } from "react"; 
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/authStore";
//import i18n from '../utils/i18n';
import { useTranslation } from 'react-i18next';



function Navbar({ isLoggedIn, onLogout }) {
  const { pathname } = useResolvedPath();
  const isHomePage = pathname === "/";

  //const [isLoggedIn, setIsLoggedIn] = useState(true);

  const { products } = useProductStore();

  const { user, logout } = useAuthStore();
  const handleLogout = () => {
		logout();
    onLogout(); // Call the onLogout prop to update the auth state
    // Optionally redirect to home or login page after logout
    // window.location.href = '/login'; // Uncomment if you want to redirect
	};
  
  const { i18n } = useTranslation();
  const changeLanguage = (event) => {
      i18n.changeLanguage(event.target.value);
    };

  
  const { t } = useTranslation();
 

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      {/*<div className="max-w-7xl mx-auto"> */}
      <div className="w-full  mx-auto ">
        <div className="navbar px-4 min-h-[4rem] justify-between ">
          {/* LOGO */}
          <div className="flex lg:flex-none s">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2 ">
                <ShoppingCartIcon className="size-3 text-primary" />
                <span
                  className="font-semibold font-mono tracking-widest  
                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  React
                </span>
              </div>
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 ">
          <select
            value={i18n.language}
            onChange={changeLanguage}
            className="btn btn-xs btn-outline btn-primary mr-2"
          >
              <option value="en">English</option>
              <option value="fr">Français</option>
          </select>
          
          <button className="btn btn-xs btn-outline btn-primary mr-2"
            onClick={isLoggedIn ? handleLogout : () => {}}>
            {isLoggedIn ? t('tr: Logout') : t('tr: Login')}
          </button>

            <ThemeSelector />

            
              <div className="indicator">
                <div className=" rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingBagIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    {products.length}
                  </span>
                </div>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
