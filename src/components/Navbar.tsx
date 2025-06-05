import  { useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { Link } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-4 mb-2 shadow-md fixed w-full top-0 left-0 z-50 bg-white dark:bg-gray-950"> {/* Increased padding, added z-index and background */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/home">
        <h1 className="text-blue-700 text-3xl font-extrabold tracking-tight"> {/* Larger, bolder title */}
          Smart Cover Letter
        </h1>
        </Link>


        <button
          className="md:hidden text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" // Added focus styles
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen} // Accessibility
          aria-controls="navbar-menu" // Accessibility
        >
          {isOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>

        {/* Navigation links - Desktop and Mobile */}
        <ul
          id="navbar-menu"
          className={`
            md:flex md:space-x-6 text-blue-700
            absolute md:static top-full left-0 w-full md:w-auto
            bg-white dark:bg-gray-950 md:bg-transparent md:dark:bg-transparent {/* Background for mobile menu */}
            shadow-lg md:shadow-none {/* Shadow only on mobile menu */}
            flex flex-col md:flex-row items-center {/* Center items vertically in mobile */}
            transition-all duration-300 ease-in-out transform
            ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 invisible md:visible'} {/* Better transition for mobile */}
            p-4 md:p-0 {/* Padding for mobile menu */}
            space-y-4 md:space-y-0 {/* Spacing for mobile list items */}
          `}
        >
          <li>
            <Link to="/form">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 w-full md:w-auto"> {/* Enhanced button styles */}
              Generate New
            </Button>
            </Link>
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
      <hr className="w-full h-0.5 bg-blue-800 border-none mt-4 md:mt-2" /> {/* Thicker hr, adjusted margin */}
    </nav>
  );
};

export default Navbar;