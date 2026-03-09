import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaArrowLeft, FaQuestionCircle, FaListAlt, FaClock,
  FaSlidersH, FaEnvelope, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

const LAST_UPDATED = '26 February 2026';

const COOKIE_TYPES = [
  {
    emoji: '🔒',
    name: 'Essential Cookies',
    purpose: 'Keep you logged in, maintain your cart, enable secure checkout, and protect against CSRF attacks.',
    examples: 'Session token, CSRF token, cart ID',
    duration: 'Session (deleted when browser closes)',
    canDisable: false,
    color: 'bg-red-50 border-red-100 text-red-700',
    pillCls: 'bg-red-100 text-red-700 border-red-200',
    pillLabel: 'Cannot disable',
  },
  {
    emoji: '⚙️',
    name: 'Preference Cookies',
    purpose: 'Remember your selected language, district, search filters, and display settings between visits.',
    examples: 'Language preference, district filter, view mode',
    duration: 'Up to 12 months',
    canDisable: true,
    color: 'bg-amber-50 border-amber-100 text-amber-700',
    pillCls: 'bg-amber-100 text-amber-700 border-amber-200',
    pillLabel: 'Optional',
  },
  {
    emoji: '📊',
    name: 'Analytics Cookies',
    purpose: 'Help us understand how users move through the marketplace so we can improve the platform for farmers and buyers.',
    examples: 'Page views, search queries, feature usage counts',
    duration: 'Up to 24 months',
    canDisable: true,
    color: 'bg-blue-50 border-blue-100 text-blue-700',
    pillCls: 'bg-blue-100 text-blue-700 border-blue-200',
    pillLabel: 'Optional — opt out anytime',
  },
  {
    emoji: '🛡️',
    name: 'Security Cookies',
    purpose: 'Detect suspicious login activity, prevent account takeover, and ensure only authorised users access account data.',
    examples: 'Rate limit tokens, fraud detection flags',
    duration: 'Session',
    canDisable: false,
    color: 'bg-gray-50 border-gray-200 text-gray-600',
    pillCls: 'bg-red-100 text-red-700 border-red-200',
    pillLabel: 'Cannot disable',
  },
];

const SECTIONS = [
  {
    id: 'what',
    icon: FaQuestionCircle,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: '1. What Are Cookies?',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          Cookies are small text files placed on your device when you visit a website or use a web application.
          They allow the platform to remember information about your visit — such as your login session or cart
          contents — so you don't have to re-enter it every time.
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          Nguzza uses cookies and similar technologies (such as local storage and session storage) to keep
          the marketplace secure, fast, and personalised for you.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-emerald-800 text-sm font-semibold">
            🌿 <strong>Good news:</strong> We do not use advertising cookies or tracking cookies. Nguzza does
            not participate in ad networks and does not share your cookie data with marketing platforms.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'types',
    icon: FaListAlt,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    title: '2. Types of Cookies We Use',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          We use four types of cookies on Nguzza. Here's exactly what each one does:
        </p>
        <div className="space-y-3">
          {COOKIE_TYPES.map((cookie, i) => (
            <div key={i} className={`border rounded-2xl p-4 sm:p-5 ${cookie.color}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cookie.emoji}</span>
                  <span className="font-black text-gray-900 text-sm sm:text-base">{cookie.name}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${cookie.pillCls}`}>
                  {cookie.pillLabel}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">{cookie.purpose}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-semibold mt-2">
                <span>📝 <em>E.g.:</em> {cookie.examples}</span>
                <span>⏱️ {cookie.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'duration',
    icon: FaClock,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    title: '3. How Long Do Cookies Last?',
    content: (
      <div className="space-y-3">
        {[
          {
            icon: '⚡',
            label: 'Session cookies',
            text: 'These are temporary and are automatically deleted when you close your browser tab or app. Used for login sessions, cart management, and CSRF protection.',
          },
          {
            icon: '📅',
            label: 'Persistent cookies',
            text: 'These remain on your device for up to 12–24 months depending on their purpose (preference or analytics). You can delete them at any time through your browser settings.',
          },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 shadow-sm">
            <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p className="font-bold text-gray-800 text-sm mb-0.5">{item.label}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'manage',
    icon: FaSlidersH,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    title: '4. Managing &amp; Disabling Cookies',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          You can control or delete cookies at any time through your browser settings. Here's how in the most common browsers:
        </p>
        <div className="space-y-2 mb-4">
          {[
            { icon: '🌐', browser: 'Chrome', path: 'Settings → Privacy and Security → Cookies and other site data' },
            { icon: '🦊', browser: 'Firefox', path: 'Settings → Privacy & Security → Cookies and Site Data' },
            { icon: '🧭', browser: 'Safari', path: 'Preferences → Privacy → Manage Website Data' },
            { icon: '🔷', browser: 'Edge', path: 'Settings → Privacy, search and services → Cookies and site data' },
            { icon: '📱', browser: 'Chrome (Android/iOS)', path: 'Settings → Site Settings → Cookies' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-3 border border-gray-100">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <div>
                <span className="font-bold text-gray-800 text-sm">{item.browser}:</span>{' '}
                <span className="text-gray-500 text-sm">{item.path}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-800 text-sm font-medium">
            ⚠️ <strong>Please note:</strong> Disabling <strong>essential or security cookies</strong> will prevent
            you from logging in and using core marketplace features such as the shopping cart and checkout.
            Optional cookies (preference and analytics) can be freely disabled without affecting core functionality.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'contact',
    icon: FaEnvelope,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: '5. Questions About Cookies',
    content: (
      <div className="bg-emerald-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[60px]" />
        <h3 className="font-black text-base sm:text-lg mb-2 relative z-10">Still have questions?</h3>
        <p className="text-emerald-100 text-sm font-medium mb-5 leading-relaxed relative z-10">
          Our support team is happy to explain how any specific cookie is used on Nguzza.
        </p>
        <a
          href="mailto:ngzdmn@gmail.com?subject=Cookie%20Policy%20Enquiry%20%E2%80%94%20Nguzza"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-900 font-black text-sm px-5 py-3 rounded-xl transition-all relative z-10"
        >
          <FaEnvelope size={12} /> ngzdmn@gmail.com
        </a>
      </div>
    ),
  },
];

export default function CookiePolicy() {
  const [openSection, setOpenSection] = useState(null);

  return (
    <>
      <Helmet>
        <title>Cookie Policy — Nguzza</title>
        <meta name="description" content="Learn how Nguzza uses cookies to keep the agricultural marketplace secure, personalised, and fast." />
      </Helmet>

      <main className="min-h-screen bg-[#fafbfc] pb-28 sm:pb-12">

        {/* Hero */}
        <section className="bg-emerald-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-transparent" />
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-400/10 rounded-full blur-[100px]" />
          <div className="max-w-4xl mx-auto px-4 py-14 sm:py-20 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-200 hover:text-white text-xs font-bold uppercase tracking-widest transition-all mb-8 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={10} />
              Back to Marketplace
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-700/60 border border-emerald-600/40 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Legal
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              Cookie Policy
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-xl leading-relaxed mb-6">
              Here's a clear, honest breakdown of the cookies Nguzza uses — what they do, how long they last, and how to control them.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-emerald-300 font-semibold">
              <span>📅 Last updated: {LAST_UPDATED}</span>
              <span className="opacity-40">•</span>
              <span>🍪 No advertising cookies</span>
            </div>
          </div>
        </section>

        {/* Policy nav links */}
        <section className="max-w-4xl mx-auto px-4 -mt-4 relative z-10 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-wrap gap-2">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest self-center px-1">Also read:</span>
            <Link to="/terms-of-use" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-100">
              📋 Terms &amp; Conditions
            </Link>
            <Link to="/privacy-policy" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-100">
              🔒 Privacy Policy
            </Link>
          </div>
        </section>

        {/* Accordion Sections */}
        <section className="max-w-4xl mx-auto px-4 space-y-3">
          {SECTIONS.map((sec) => {
            const isOpen = openSection === sec.id;
            return (
              <div key={sec.id} className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenSection(isOpen ? null : sec.id)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-gray-50/60 transition-all group"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 ${sec.color}`}>
                    <sec.icon className="text-base sm:text-lg" />
                  </div>
                  <span
                    className="font-black text-gray-900 text-sm sm:text-base flex-1 leading-snug"
                    dangerouslySetInnerHTML={{ __html: sec.title }}
                  />
                  <span className="text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0">
                    {isOpen ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-gray-50">
                    {sec.content}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section className="max-w-4xl mx-auto px-4 mt-8 text-center">
          <p className="text-xs text-gray-400 font-medium">
            This Cookie Policy was last updated on {LAST_UPDATED}. We may update this policy if we introduce new
            technologies or change how we use existing cookies. Updates will be reflected on this page.
          </p>
        </section>

      </main>
    </>
  );
}
