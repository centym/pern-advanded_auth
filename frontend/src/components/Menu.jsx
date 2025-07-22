import { useState } from "react";
import { LucideMenu , XIcon} from "lucide-react";
import { Link } from "react-router-dom";
function Sidebar({ isOpen, onClose }) {
 
    return (
        // Conteneur principal de la sidebar.
        // Utilise des classes Tailwind pour la position fixe, la hauteur pleine, la largeur,
        // l'arrière-plan, l'ombre et la transition pour l'animation d'entrée/sortie.
        // La classe 'translate-x-full' cache la sidebar par défaut à droite,
        // 'translate-x-0' la rend visible.
        <div
          className={`fixed top-70 left-0  w-64 bg-gray-300 shadow-lg transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-4">
            {/* Bouton de fermeture de la sidebar */}
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 hover:text-3xl focus:outline-none text-2xl font-bold"
              aria-label="Fermer la barre latérale"
            >
              &times; {/* Symbole 'x' pour fermer */}
            </button>
            {/* Titre de la sidebar */}
            <h2 className="text-2xl font-semibold mt-4 text-gray-800"></h2>
            {/* Liens de navigation de la sidebar */}
            <nav className="mt-6 ">
              <ul>
                <li className="mb-4 border-t-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400">
                  <Link to="/" onClick={onClose} className="hover:opacity-70 transition-opacity">
                    <div className="flex items-center gap-2 ">
                        <span
                            className="font-semibold font-mono tracking-widest  
                                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                        >
                            React
                        </span>
                    </div>
                  </Link>
                </li>
                <li className="mb-4 border-t-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400">
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-600 transition-colors duration-200">
                    À propos
                  </a>
                </li>
                <li className="mb-4 border-t-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400">
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-600 transition-colors duration-200">
                    Services
                  </a>
                </li>
                <li className="mb-4 border-t-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400">
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-600 transition-colors duration-200">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      );
}

export default Sidebar;