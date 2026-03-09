import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaArrowLeft, FaShieldAlt, FaDatabase, FaCog, FaShareAlt,
  FaClock, FaUserShield, FaLock, FaBaby, FaEnvelope,
  FaChevronDown, FaChevronUp
} from 'react-icons/fa';

const LAST_UPDATED = '26 February 2026';

const DATA_TABLE = [
  { type: 'Account Info', examples: 'Full name, email address, phone number, hashed password', required: 'required' },
  { type: 'Vendor / Seller Info', examples: 'Business name, district, product categories, payment/bank details', required: 'vendors' },
  { type: 'Transaction Data', examples: 'Orders placed or received, payment amounts, delivery addresses', required: 'required' },
  { type: 'Usage Data', examples: 'Pages visited, search queries, products viewed, device type, IP address', required: 'auto' },
  { type: 'Support Communications', examples: 'Messages you send to support, reviews and ratings you post', required: 'when' },
];

const PILL = {
  required: { label: 'Required', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  vendors: { label: 'Vendors only', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  auto: { label: 'Automatic', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  when: { label: 'When you interact', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const SECTIONS = [
  {
    id: 'commitment',
    icon: FaShieldAlt,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: '1. Our Commitment to Your Privacy',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          Nguzza is committed to protecting the personal information of every farmer, buyer, vendor, service
          provider, and visitor who uses our platform. This Privacy Policy explains exactly what data we collect,
          why we collect it, how we use it, and the choices and rights available to you.
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          This policy is written in accordance with the <strong>Uganda Data Protection and Privacy Act, 2019</strong>{' '}
          and the <strong>Uganda Data Protection and Privacy Regulations, 2021</strong>.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-emerald-800 text-sm font-semibold leading-relaxed">
            ✅ <strong>Plain language promise:</strong> We will never sell your personal data to advertisers or
            third parties. We share your data only when strictly necessary to operate the marketplace or comply with the law.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'collection',
    icon: FaDatabase,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    title: '2. Information We Collect',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          We collect data you provide directly (during registration, checkout, or vendor sign-up) and data
          generated automatically as you use the platform.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-800 text-white">
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider rounded-tl-2xl">Data Type</th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider">Examples</th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {DATA_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                  <td className="px-4 py-3 font-bold text-gray-800 text-xs whitespace-nowrap align-top">{row.type}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed">{row.examples}</td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${PILL[row.required].cls}`}>
                      {PILL[row.required].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'use',
    icon: FaCog,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    title: '3. How We Use Your Data',
    content: (
      <div className="space-y-3">
        {[
          { icon: '🛒', label: 'Marketplace operations', text: 'Processing orders, coordinating payments, connecting buyers with sellers and service providers.' },
          { icon: '🔔', label: 'Communications', text: 'Sending order confirmations, support responses, account alerts, and important platform updates.' },
          { icon: '🔍', label: 'Personalisation', text: 'Improving product search results and showing you relevant listings based on your activity and location.' },
          { icon: '🚨', label: 'Safety & security', text: 'Detecting and preventing fraud, account abuse, and unauthorised access to the platform.' },
          { icon: '📊', label: 'Platform improvement', text: 'Analysing anonymised usage patterns to fix bugs, improve performance, and build better features.' },
          { icon: '📜', label: 'Legal compliance', text: 'Meeting obligations under the Uganda Data Protection and Privacy Act, 2019, and other applicable Ugandan law.' },
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
    id: 'sharing',
    icon: FaShareAlt,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    title: '4. Who We Share Your Data With',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          We share your information only in these limited and clearly defined circumstances:
        </p>
        <div className="space-y-3 mb-4">
          {[
            { icon: '🚚', label: 'Sellers & vendors', text: 'Your name, delivery address, and order details are shared with the seller to fulfil your order — nothing beyond what is necessary.' },
            { icon: '💳', label: 'Payment providers', text: 'Secure payment processors (MTN Mobile Money, Airtel Money) receive transaction data to complete payments on your behalf.' },
            { icon: '☁️', label: 'Service providers', text: 'Trusted hosting, email, analytics, and security partners who process your data strictly on our behalf and are bound by confidentiality agreements.' },
            { icon: '⚖️', label: 'Law enforcement', text: 'When legally required by Ugandan law or court order, or to protect the rights and safety of users or the public.' },
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
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-700 text-sm font-semibold">
            🚫 <strong>We never sell your personal data</strong> to third parties, advertisers, data brokers, or marketing platforms — ever.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'retention',
    icon: FaClock,
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    title: '5. Data Retention',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          We retain your data only for as long as is necessary. The table below outlines our retention periods:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-800 text-white">
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider rounded-tl-2xl">Data Type</th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider rounded-tr-2xl">How Long We Keep It</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Account information', period: 'Active account lifetime + 12 months after deletion' },
                { type: 'Transaction records', period: '7 years (Uganda tax & commercial law requirement)' },
                { type: 'Usage / analytics data', period: 'Up to 24 months, then anonymised or deleted' },
                { type: 'Support communications', period: '3 years from last contact' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                  <td className="px-4 py-3 font-bold text-gray-800 text-xs">{row.type}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'rights',
    icon: FaUserShield,
    color: 'bg-green-50 text-green-600 border-green-100',
    title: '6. Your Rights Under Ugandan Law',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          Under the <strong>Uganda Data Protection and Privacy Act, 2019</strong>, you have the following rights regarding your personal data:
        </p>
        <div className="space-y-3 mb-5">
          {[
            { icon: '👁️', label: 'Right of access', text: 'Request a copy of all personal data we hold about you.' },
            { icon: '✏️', label: 'Right to correction', text: 'Ask us to correct inaccurate or incomplete personal data.' },
            { icon: '🗑️', label: 'Right to erasure', text: 'Request deletion of your data, subject to legal retention requirements (e.g. transaction records).' },
            { icon: '⛔', label: 'Right to object', text: 'Object to how we process your data for profiling or direct marketing purposes.' },
            { icon: '📤', label: 'Right to data portability', text: 'Receive your data in a structured, commonly used, machine-readable format.' },
            { icon: '📋', label: 'Right to lodge a complaint', text: 'Lodge a complaint with the Uganda National Information Technology Authority (NITA-U) if you believe your rights have been violated.' },
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
        <div className="bg-emerald-900 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-[50px]" />
          <h3 className="font-black text-base mb-1 relative z-10">Exercise Your Rights</h3>
          <p className="text-emerald-100 text-sm font-medium mb-4 relative z-10">
            Send us a request and we will respond within 30 days in accordance with Ugandan law.
          </p>
          <a
            href="mailto:ngzdmn@gmail.com?subject=Data%20Rights%20Request%20%E2%80%94%20Nguzza"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-900 font-black text-sm px-5 py-2.5 rounded-xl transition-all relative z-10"
          >
            <FaEnvelope size={12} /> ngzdmn@gmail.com
          </a>
        </div>
      </>
    ),
  },
  {
    id: 'security',
    icon: FaLock,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: '7. Security',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          We take reasonable technical and organisational measures to protect your data, including:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Encrypted storage of sensitive data including passwords (hashed) and payment information.',
            'HTTPS encryption for all data transmitted between your device and our servers.',
            'Role-based access controls that limit which Nguzza staff can view personal data.',
            'Regular security reviews and monitoring for suspicious activity.',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
              <span className="text-emerald-500 font-black text-sm flex-shrink-0 mt-0.5">✓</span>
              <span className="text-gray-600 text-sm font-medium leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-800 text-sm font-medium">
            ⚠️ <strong>Important:</strong> No method of internet transmission is 100% secure. While we strive to
            protect your data, we cannot guarantee absolute security. Please use a strong, unique password and
            never share your account credentials with anyone.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'minors',
    icon: FaBaby,
    color: 'bg-pink-50 text-pink-500 border-pink-100',
    title: '8. Children\'s Privacy',
    content: (
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
        Nguzza is not directed at, and does not knowingly collect personal data from, users under the age of 18.
        If we become aware that we have inadvertently collected data from a minor without verifiable parental
        consent, we will delete it promptly. If you believe we may have collected data from a minor, please
        contact us immediately at{' '}
        <a href="mailto:ngzdmn@gmail.com" className="text-emerald-700 font-bold hover:underline">
          ngzdmn@gmail.com
        </a>.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState(null);

  return (
    <>
      <Helmet>
        <title>Privacy Policy — Nguzza</title>
        <meta name="description" content="Nguzza's Privacy Policy — how we collect, use, and protect your data under the Uganda Data Protection and Privacy Act, 2019." />
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
              Privacy Policy
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-xl leading-relaxed mb-6">
              We value your trust. This policy explains how Nguzza handles your personal information — simply, honestly, and in full compliance with Ugandan law.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-emerald-300 font-semibold">
              <span>📅 Last updated: {LAST_UPDATED}</span>
              <span className="opacity-40">•</span>
              <span>🇺🇬 Uganda Data Protection &amp; Privacy Act, 2019</span>
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
            <Link to="/cookie-policy" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-100">
              🍪 Cookie Policy
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
                  <span className="font-black text-gray-900 text-sm sm:text-base flex-1 leading-snug">
                    {sec.title}
                  </span>
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
            This Privacy Policy was last updated on {LAST_UPDATED}. Nguzza may update this policy from time to
            time. We will notify you of significant changes via email or in-app notice. Continued use of the
            platform after updates constitutes acceptance of the revised policy.
          </p>
        </section>

      </main>
    </>
  );
}
