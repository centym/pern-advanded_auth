import { Link, useResolvedPath } from "react-router-dom";
//import { useState } from "react"; 
import { ShoppingBagIcon, ShoppingCartIcon, LogOut } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/authStore";
//import i18n from '../utils/i18n';
import { useTranslation } from 'react-i18next';
import { useState} from 'react';

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
  const changeLanguage = (value) => {
      i18n.changeLanguage(value);
    };

  
  const { t } = useTranslation();
 
  const options = [
    { value: "fr", label: "Français", icon: "/locales/flags/fr.svg" },
    { value: "en", label: "English", icon: "/locales/flags/gb.svg" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option) => {
    setSelected(option);
    setIsOpen(false); // <— Ferme le menu ici
  };
  

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

          <div className="flex items-center gap-3  ">
           
    


          
    
          <div className="relative flex    w-full justify-end items-center gap-2">
               <button 
                      onClick={toggleDropdown} 
                      className="btn  btn-xs btn-primary "   >
                        {i18n.language}

              </button>
              <img  src={`/locales/flags/${i18n.language}.svg`} alt="Language" 
                          className="h-8 w-8 rounded-full mr-2" />
              {isOpen && (
                 <div className="absolute top-full left-0 mt-1 bg-white">
                <ul className="   pl-0 bg-blue border rounded shadow">
                    {options.map((options) => (
                      <li
                      
                        key={options.value}
                        value={options.value}
                        className=" bg-gray-300 hover:bg-gray-400 border cursor-pointer"
                        onClick={() => console.log(options.value)}
                      >

                        <button
                          key={options.value}
                          value={options.value}
                          className=" py-2 w-24 text-black rounded-xl flex items-center  "
                          onClick={() => { selectOption(options.value); changeLanguage(options.value)}}
                        > 
                          <img
                            src={options.icon}
                            alt={options.label}
                            className="h-6 w-6 rounded-full mr-2 "
                          />
                          {options.label}
                          

                        </button>

                      </li>
                    ))}
                  </ul>
                  </div>
                )}
            </div>
          
   
         
          
          <button className="btn btn-xs btn-outline btn-primary mr-2"
            onClick={isLoggedIn ? handleLogout : () => {}}>
            <LogOut className="inline size-4 ml-1" />

          </button>

          
              <div className="indicator mr-2">
                <div className=" rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingBagIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    {products.length}
                  </span>
                </div>
              </div>
              
              <ThemeSelector />

          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
