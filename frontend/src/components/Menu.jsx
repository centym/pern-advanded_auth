import { useState } from "react";
import { LucideMenu , XIcon} from "lucide-react";

function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div >
      {/* Bouton Hamburger */}
      <button
        aria-label="Ouvrir/fermer le menu"
        className="p-2"
        onClick={() => setOpen(!open)}
      >
        {/* Icône SVG hamburger/croix */}
        {open ? (
          // Croix pour fermer
          <XIcon className="size-5 text-primary" />
          
        ) : (
          // Trois barres pour ouvrir
          <LucideMenu className="size-5 text-primary" />

        )}
      </button>

      {/* Menu déroulant conditionnel */}
      {open && (
        <div className="absolute left-0 top-full  shadow-lg z-50   text-black rounded-lg  bg-gray-300 border cursor-pointer  w-48">
         
          <a  href="/" className="block px-4 py-2 border-b  hover:bg-gray-400">Accueil</a>
          <a href="/about" className="block px-4 py-2 border-b  hover:bg-gray-400">À propos</a>
          <a href="/contact" className="block px-4 py-2  hover:bg-gray-400">Contact</a>
        </div>
      )}
    </div>
  );
}

export default Menu;
