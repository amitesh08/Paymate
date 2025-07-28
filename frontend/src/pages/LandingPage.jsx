"use client";

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Download,
  Users,
  CheckCircle,
  Send,
  CreditCard,
  Star,
} from "lucide-react";
import useUser from "../hooks/useUser";

export default function LandingPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Paymate</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <button className="px-4 py-2 text-gray-600 cursor-pointer hover:text-blue-600 font-medium transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-medium shadow-sm transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
            <Star className="w-4 h-4 mr-2" />
            Trusted by thousands of users
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Payments Made <span className="text-blue-600">Simple</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Send money, request payments, and track transactions with ease. Your
            peer-to-peer payment solution that just works.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/signup">
              <button className="px-8 py-4 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                Get Started Free
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
            <Link to="/signin">
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 cursor-pointer hover:border-blue-300 hover:text-blue-600 rounded-lg text-lg font-medium transition-all duration-300 bg-white">
                Sign In
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                Instant
              </div>
              <div className="text-sm text-gray-500">Money Transfers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-sm text-gray-500">Secure Payments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for modern payments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Send size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Instant Transfers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Send money to anyone instantly with just their email or phone
                number. No delays, no hassles.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Payment Requests
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Request money from friends and family. They can approve or
                decline with a single tap.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Download size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Transaction History
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Keep track of all your payments and download detailed PDF
                reports anytime.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <Shield size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Bank-Level Security
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your money and data are protected with enterprise-grade security
                measures.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Zap size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Experience blazing-fast transactions that complete in seconds,
                not minutes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <CreditCard size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Multiple Payment Methods
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect your bank account, credit card, or digital wallet for
                seamless payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="px-4 sm:px-6 lg:px-8 py-20 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            How Paymate Works
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Get started in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Sign Up
              </h3>
              <p className="text-gray-600">
                Create your free account in under 2 minutes with just your email
              </p>
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -translate-x-1/2"></div>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Connect
              </h3>
              <p className="text-gray-600">
                Link your bank account or add your payment method securely
              </p>
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -translate-x-1/2"></div>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Send & Receive
              </h3>
              <p className="text-gray-600">
                Start sending money, requesting payments, and managing
                transactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            Why thousands choose Paymate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <CheckCircle
                size={24}
                className="text-white flex-shrink-0 mt-1"
              />
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
                <p className="text-blue-100">
                  Transparent pricing with no surprise charges or hidden costs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <CheckCircle
                size={24}
                className="text-white flex-shrink-0 mt-1"
              />
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-blue-100">
                  Get help whenever you need it with our round-the-clock support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <CheckCircle
                size={24}
                className="text-white flex-shrink-0 mt-1"
              />
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
                <p className="text-blue-100">
                  Perfect experience on any device, anywhere, anytime
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <CheckCircle
                size={24}
                className="text-white flex-shrink-0 mt-1"
              />
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">
                  Instant Notifications
                </h3>
                <p className="text-blue-100">
                  Stay updated with real-time alerts for all your transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who trust Paymate for their daily
            transactions
          </p>

          <Link to="/signup">
            <button className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300  inline-flex items-center gap-3 group">
              Start Using Paymate Today
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free to get started
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="px-4 sm:px-6 lg:px-8 py-12 bg-white border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="text-2xl font-bold text-blue-600 mb-4">
                Paymate
              </div>
              <p className="text-gray-600">
                Making payments simple and secure for everyone.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Paymate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
