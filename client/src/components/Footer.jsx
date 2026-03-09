import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeadset, FaShieldAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-20 sm:pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 text-left">
              <img src="/logo.png" alt="Nguzza" className="h-7 w-auto" />
              <span className="font-black text-xl text-emerald-800 tracking-tighter">Nguzza</span>
            </Link>
            <p className="text-gray-500 text-[11px] leading-relaxed mb-4 max-w-xs text-left">
              Uganda's trusted marketplace connecting farmers with buyers and verified sellers.
            </p>
            <a href="mailto:ngzdmn@gmail.com" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-[10px] font-bold">
              <FaHeadset className="text-[10px]" /> ngzdmn@gmail.com
            </a>
          </div>

          {/* Company Links */}
          <div className="text-left">
            <h4 className="font-black text-emerald-900 mb-4 text-[10px] uppercase tracking-widest">Company</h4>
            {/* horizontal on mobile (default), vertical on md+ */}
            <nav aria-label="Company links">
              <ul className="flex flex-row flex-wrap gap-3 text-[11px] font-semibold text-gray-500 md:flex-col md:gap-0 md:space-y-2">
                <li className="">
                  <Link to="/about" className="hover:text-emerald-700">About Us</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-emerald-700">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-use" className="hover:text-emerald-700">Terms of Use</Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="hover:text-emerald-700">Cookie Policy</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Trust & Safety Column */}
          <div className="col-span-2 sm:col-span-1 text-left">
            <h4 className="font-black text-emerald-900 mb-4 text-[10px] uppercase tracking-widest">Trust & Safety</h4>
            <div className="flex items-start gap-3 bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
              <FaShieldAlt className="text-emerald-700 text-lg mt-0.5" />
              <div>
                <span className="block font-black text-[9px] text-emerald-800 uppercase tracking-wider mb-1">Buyer Protection</span>
                <p className="text-[10px] text-emerald-700/80 font-medium leading-tight">
                  All listings are moderated for safety.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
            © {new Date().getFullYear()} NGUZZA UGANDA. All rights reserved.
          </p>
          <div className="flex gap-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">
            <Link to="/privacy-policy" className="hover:text-emerald-900 transition-colors">Privacy</Link>
            <Link to="/terms-of-use" className="hover:text-emerald-900 transition-colors">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-emerald-900 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
