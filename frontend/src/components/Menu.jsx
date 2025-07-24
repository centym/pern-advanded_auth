import { Link, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate(); // Initialize useNavigate
    return (
        // Conteneur principal de la sidebar.
        // Utilise des classes Tailwind pour la position fixe, la hauteur pleine, la largeur,
        // l'arrière-plan, l'ombre et la transition pour l'animation d'entrée/sortie.
        // La classe 'translate-x-full' cache la sidebar par défaut à droite,
        // 'translate-x-0' la rend visible.
        <div
          className={`fixed border-4 border-blue-500 top-70 left-0  w-64 bg-gray-300 shadow-lg transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }  transition-transform duration-1000 ease-in-out z-50`}
        >
          <div className="p-4 text-lg text-gray-700 hover:text-blue-600 transition-colors ">
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
            <nav >
              <ul className="p-2 ">
                <li className="m-2 p-2  border-t-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400  text-gray-700 transition-colors duration-1000">
                  <Link to="/" onClick={onClose} >
                            React
                  </Link>
                </li>
                <li className="m-2 p-2 border-t-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400">
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-600 transition-colors duration-1000">
                    À propos
                  </a>
                </li>
                <li className="m-2 p-2 border-t-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400">
                  <button className="cursor-pointer w-full text-left text-lg text-gray-700 hover:text-blue-600 transition-colors duration-1000"
                  onClick={() => { onClose(); navigate("/product/producthome"); }}>
                    Services
                  </button>
                </li>
                <li className="m-2 p-2 border-t-2 border-b-2 border-blue-500 hover:text-blue-600 hover:bg-gray-400">
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-600 transition-colors duration-1000">
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