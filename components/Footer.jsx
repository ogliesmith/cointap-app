import React from 'react';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/20/solid';

function Footer() {
  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 mb-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <Link href="/" className="flex items-center space-x-2">
              <SparklesIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              <span className="text-xl font-semibold dark:text-white">CoinTap – Tap In, Get Free Coins</span>
            </Link>
            
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            {/* Navigation Links */}
            <ul className="flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:underline me-4 md:me-6">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline me-4 md:me-6">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline me-4 md:me-6">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline me-4 md:me-6">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          &copy; 2025 <Link href="/">CoinTap – Tap In, Get Free Coins</Link> <br />
          All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
