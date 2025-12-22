import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
      
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-6 gap-8 max-w-6xl text-center">

          {/* Empty first column */}
          <div></div>

          {/* Logo & Description */}
          <div className="col-span-1 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="text-primary size-6">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-text-light dark:text-text-dark">POTHIK</h2>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Your ultimate travel companion for exploring the world.
            </p>
          </div>

          {/* Company */}
          <div className="col-span-1 flex flex-col items-center">
            <h3 className="font-semibold text-sm">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-primary" to="/about">About Us</Link></li>
              <li><Link className="hover:text-primary" to="/careers">Careers</Link></li>
              <li><Link className="hover:text-primary" to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1 flex flex-col items-center">
            <h3 className="font-semibold text-sm">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-primary" to="/contact">Contact</Link></li>
              <li><Link className="hover:text-primary" to="/faq">FAQ</Link></li>
              <li><Link className="hover:text-primary" to="/help">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 flex flex-col items-center">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-primary" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary" to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Empty last column */}
          <div></div>

        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-border-light dark:border-border-dark pt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2024 POTHIK. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
