import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaArrowLeft, FaHandshake, FaUserCheck, FaLeaf, FaBan,
  FaMoneyBillWave, FaCopyright, FaBalanceScale, FaFlag, FaEnvelope,
  FaChevronDown, FaChevronUp
} from 'react-icons/fa';

const LAST_UPDATED = '26 February 2026';

const SECTIONS = [
  {
    id: 'acceptance',
    icon: FaHandshake,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: '1. Acceptance of Terms',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          By accessing or using Nguzza — including our website, mobile application, or any related
          services — you confirm that you have read, understood, and agree to be legally bound by
          these Terms &amp; Conditions and all applicable Ugandan laws.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <span className="text-amber-500 text-lg mt-0.5 flex-shrink-0">⚠️</span>
          <p className="text-amber-800 text-sm font-medium leading-relaxed">
            If you do not agree with any part of these terms, you must stop using Nguzza immediately.
            Continued use of the platform constitutes full acceptance.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'eligibility',
    icon: FaUserCheck,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    title: '2. Eligibility &amp; Account Responsibilities',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          To register and use Nguzza, you must meet all of the following requirements:
        </p>
        <ul className="space-y-3 mb-4">
          {[
            { icon: '🔞', text: 'Be at least 18 years of age, or have the verifiable consent of a parent or legal guardian.' },
            { icon: '📍', text: 'Be legally permitted to buy, sell, or trade agricultural goods and services in Uganda.' },
            { icon: '📋', text: 'Provide accurate, complete, and current registration information at all times.' },
            { icon: '🔐', text: 'Keep your login credentials strictly confidential and notify us immediately of any suspected unauthorised access.' },
            { icon: '👤', text: 'Maintain only one personal account. Multiple accounts for a single individual are not permitted.' },
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
              <span className="text-gray-600 text-sm font-medium leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-500 text-sm font-medium">
          You are solely responsible for all activity that occurs under your account, whether or not authorised by you.
        </p>
      </>
    ),
  },
  {
    id: 'listings',
    icon: FaLeaf,
    color: 'bg-green-50 text-green-600 border-green-100',
    title: '3. Listings, Products &amp; Transactions',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          Nguzza is a marketplace that connects farmers, vendors, buyers, and service providers.
          We facilitate — but are not a direct party to — the transactions between users.
        </p>
        <div className="space-y-3 mb-4">
          {[
            { icon: '📸', label: 'Accurate listings', text: 'Sellers must provide truthful descriptions, current prices, correct quantities, and clear images for all products and services listed on the platform.' },
            { icon: '✅', label: 'Permitted products', text: 'Only lawful agricultural products, certified inputs, equipment, livestock, and related services may be listed. Counterfeit goods, controlled substances, and any items prohibited under Ugandan law are strictly forbidden.' },
            { icon: '🛒', label: 'Buyer due diligence', text: 'Buyers are responsible for reviewing all product details, asking questions before purchase, and confirming quality upon delivery.' },
            { icon: '🛡️', label: 'Moderation', text: 'Nguzza reserves the right to remove any listing that violates these terms, misrepresents products, compromises safety, or degrades the quality of the marketplace — without prior notice.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">{item.label}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-emerald-800 text-sm font-medium">
            <strong>Disputes:</strong> In the event of a buyer-seller dispute, contact us at{' '}
            <a href="mailto:ngzdmn@gmail.com" className="text-emerald-700 font-bold hover:underline">
              ngzdmn@gmail.com
            </a>. We will make reasonable efforts to assist, but cannot guarantee resolution outcomes as we are not a party to the transaction.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'prohibited',
    icon: FaBan,
    color: 'bg-red-50 text-red-500 border-red-100',
    title: '4. Prohibited Conduct',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          To protect all users and maintain a trustworthy marketplace, the following conduct is strictly prohibited and may result in immediate account termination:
        </p>
        <ul className="space-y-2">
          {[
            'Fraud, scamming, misrepresentation, or any form of deceptive practice toward other users or Nguzza.',
            'Harassment, threats, hate speech, or abuse directed at other users, vendors, farmers, or Nguzza staff.',
            'Posting fake reviews, artificially inflating product ratings, or manipulating the marketplace reputation system.',
            'Circumventing platform fees by transacting off-platform after connecting through Nguzza.',
            'Using automated bots, scrapers, crawlers, or similar tools without prior written permission from Nguzza.',
            'Sharing, selling, or disclosing another user\'s personal information without their explicit consent.',
            'Listing products that are counterfeit, stolen, harmful, or prohibited under the laws of Uganda.',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start bg-red-50/60 rounded-xl p-3 border border-red-100">
              <span className="text-red-400 font-black text-sm flex-shrink-0 mt-0.5">✕</span>
              <span className="text-gray-600 text-sm font-medium leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-4">
          <p className="text-red-700 text-sm font-medium">
            Violations may result in account suspension or permanent ban, forfeiture of pending funds, and/or reporting to Uganda Police or relevant regulatory authorities.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'payments',
    icon: FaMoneyBillWave,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    title: '5. Payments &amp; Fees',
    content: (
      <>
        <div className="space-y-3">
          {[
            { icon: '💳', label: 'Platform fees', text: 'Nguzza may charge transaction or listing fees. Any applicable fees will always be clearly disclosed to you before a transaction is completed. We will not charge hidden fees.' },
            { icon: '🔒', label: 'Secure payment processing', text: 'Payments are processed through trusted third-party providers, including mobile money services (MTN MoMo, Airtel Money). Nguzza does not store your full payment card or mobile money PIN.' },
            { icon: '🔄', label: 'Refunds', text: 'Refund eligibility depends on the individual seller\'s policy and the nature of the dispute. Nguzza facilitates refund requests in good faith but cannot compel sellers in all circumstances.' },
            { icon: '💱', label: 'Currency', text: 'All prices are displayed and transacted in Ugandan Shillings (UGX) unless explicitly stated otherwise on a listing.' },
            { icon: '📜', label: 'Tax compliance', text: 'Sellers are responsible for their own tax obligations under the Uganda Revenue Authority (URA) rules, including VAT where applicable.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">{item.label}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'ip',
    icon: FaCopyright,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    title: '6. Intellectual Property',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          All Nguzza branding, logos, platform design, software, and technology are owned by or exclusively
          licensed to Nguzza. You may not copy, reproduce, distribute, or create derivative works based on
          Nguzza's intellectual property without prior written permission.
        </p>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-purple-800 text-sm font-medium leading-relaxed">
            <strong>Your content:</strong> By posting photos, descriptions, or reviews on Nguzza, you grant us a
            non-exclusive, royalty-free, worldwide licence to display and promote that content on the platform for
            as long as it remains published. You retain ownership of your content.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'liability',
    icon: FaBalanceScale,
    color: 'bg-gray-50 text-gray-500 border-gray-200',
    title: '7. Limitation of Liability',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          Nguzza provides its platform on an <em>"as is"</em> and <em>"as available"</em> basis.
          To the fullest extent permitted under Ugandan law, we are not liable for:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Direct or indirect losses arising from transactions between buyers and sellers.',
            'Platform downtime, technical errors, or interruptions to service.',
            'Product quality, non-delivery, or fitness-for-purpose disputes between users.',
            'The content, conduct, or actions of third-party sellers and service providers.',
            'Losses arising from unauthorised access to your account due to your failure to secure credentials.',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-gray-400 font-black text-sm flex-shrink-0 mt-0.5">—</span>
              <span className="text-gray-600 text-sm font-medium leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-500 text-sm font-medium">
          Our total aggregate liability to any user shall not exceed the total amount you paid to Nguzza
          in the three (3) months immediately preceding the claim.
        </p>
      </>
    ),
  },
  {
    id: 'governing',
    icon: FaFlag,
    color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    title: '8. Governing Law',
    content: (
      <>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-4">
          These Terms &amp; Conditions are governed by, and shall be interpreted in accordance with,
          the laws of the <strong>Republic of Uganda</strong>, including but not limited to:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'The Electronic Transactions Act, 2011',
            'The Computer Misuse Act, 2011',
            'The Consumer Protection Guidelines (UNBS)',
            'The Sale of Goods Act (Cap. 82)',
          ].map((law, i) => (
            <li key={i} className="flex gap-3 items-center bg-yellow-50/60 rounded-xl px-4 py-3 border border-yellow-100">
              <span className="text-yellow-500 text-sm">⚖️</span>
              <span className="text-gray-700 text-sm font-semibold">{law}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-500 text-sm font-medium">
          Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts
          of Uganda. If any clause is found to be invalid or unenforceable, the remaining terms continue in
          full force and effect.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    icon: FaEnvelope,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: '9. Contact &amp; Support',
    content: (
      <div className="bg-emerald-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[60px]" />
        <h3 className="font-black text-lg sm:text-xl mb-2 relative z-10">Questions about these terms?</h3>
        <p className="text-emerald-100 text-sm font-medium mb-5 leading-relaxed relative z-10">
          Our support team is available to help you understand your rights and obligations on the Nguzza platform.
        </p>
        <a
          href="mailto:ngzdmn@gmail.com?subject=Terms%20%26%20Conditions%20Enquiry%20%E2%80%94%20Nguzza"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-900 font-black text-sm px-5 py-3 rounded-xl transition-all relative z-10"
        >
          <FaEnvelope /> ngzdmn@gmail.com
        </a>
      </div>
    ),
  },
];

export default function TermsOfUse() {
  const [openSection, setOpenSection] = useState(null);

  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions — Nguzza</title>
        <meta name="description" content="Read Nguzza's Terms and Conditions governing use of Uganda's agricultural marketplace." />
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
              Terms &amp; Conditions
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-xl leading-relaxed mb-6">
              These terms govern your use of the Nguzza agricultural marketplace. Please read them carefully before using the platform.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-emerald-300 font-semibold">
              <span>📅 Last updated: {LAST_UPDATED}</span>
              <span className="opacity-40">•</span>
              <span>🇺🇬 Governed by Ugandan Law</span>
            </div>
          </div>
        </section>

        {/* Policy nav links */}
        <section className="max-w-4xl mx-auto px-4 -mt-4 relative z-10 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-wrap gap-2">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest self-center px-1">Also read:</span>
            <Link to="/privacy-policy" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-100">
              🔒 Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-100">
              🍪 Cookie Policy
            </Link>
          </div>
        </section>

        {/* Intro callout */}
        <section className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 flex gap-4">
            <span className="text-3xl flex-shrink-0">🤝</span>
            <div>
              <h2 className="font-black text-gray-900 text-base sm:text-lg mb-1 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-emerald-600 rounded-full inline-block" /> Our Agreement With You
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
                Nguzza operates Uganda's agricultural marketplace under these terms. We've written them in plain language so
                farmers, buyers, vendors, and service providers know exactly where they stand. If something is unclear,
                please reach out — we're happy to explain.
              </p>
            </div>
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

        {/* Bottom note */}
        <section className="max-w-4xl mx-auto px-4 mt-8 text-center">
          <p className="text-xs text-gray-400 font-medium">
            These terms were last updated on {LAST_UPDATED} and supersede all previous versions.
            Nguzza may update these terms at any time; continued use of the platform after changes
            constitutes acceptance of the revised terms.
          </p>
        </section>

      </main>
    </>
  );
}
