import React from 'react';
import { Heart, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-t border-blue-500">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">PetroPro</h3>
            <p className="text-blue-100 text-sm">
              Advanced petrol pump management system for modern fuel stations.
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-100">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Made with love for the fuel industry</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="text-blue-100 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/master" className="text-blue-100 hover:text-white transition-colors">
                  Master Data
                </a>
              </li>
              <li>
                <a href="/reports" className="text-blue-100 hover:text-white transition-colors">
                  Reports
                </a>
              </li>
              <li>
                <a href="/calculator" className="text-blue-100 hover:text-white transition-colors">
                  Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-blue-100">
                <Mail className="h-4 w-4" />
                <span>support@petropro.com</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@petropro.com"
                className="text-blue-100 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="text-xs text-blue-200">
              <p>Version 1.0.0</p>
              <p>© {currentYear} PetroPro. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-blue-500">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-100">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
            </div>
            <div className="text-center md:text-right">
              <p>Powered by Modern Technology</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;