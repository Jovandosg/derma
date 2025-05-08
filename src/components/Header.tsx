import React from 'react';
import { Brain } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">DermAnalyzer</h1>
          </div>
          <nav className="flex space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;