import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-2 space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Contact
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} DermAnalyzer. All rights reserved. For educational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;