import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaSeedling, FaPaw, FaLeaf, FaTractor, FaHandshake, FaShieldAlt, FaUsers, FaGlobeAfrica, FaArrowLeft } from "react-icons/fa";

const CATEGORIES_INFO = [
  { icon: FaSeedling, name: "Crops", desc: "Seeds, grains, fresh produce & root crops", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: FaPaw, name: "Livestock", desc: "Cattle, poultry, goats, sheep & small stock", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { icon: FaLeaf, name: "Inputs", desc: "Fertilizers, seeds, agrochemicals & feeds", color: "bg-green-50 text-green-600 border-green-100" },
  { icon: FaTractor, name: "Equipment", desc: "Tractors, tools, irrigation & processing", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: FaHandshake, name: "Services", desc: "Extension, transport & mechanization", color: "bg-purple-50 text-purple-600 border-purple-100" },
];

const STATS = [
  { icon: FaUsers, value: "10,000+", label: "Active Farmers" },
  { icon: FaGlobeAfrica, value: "112+", label: "Districts Covered" },
  { icon: FaShieldAlt, value: "100%", label: "Verified Listings" },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Nguzza — Agriculture Marketplace</title>
        <meta name="description" content="Nguzza is an agricultural marketplace connecting farmers, buyers and service providers — crops, livestock, inputs, equipment and services — across Uganda." />
        <meta name="keywords" content="Nguzza, agriculture marketplace, crops, livestock, farm inputs, farming equipment, agricultural services, Uganda" />
        <link rel="canonical" href="https://nguzza.onrender.com/about" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Nguzza",
            "url": "https://nguzza.onrender.com",
            "description": "A marketplace for agricultural goods and services in Uganda.",
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#fafbfc] pb-28 sm:pb-12">
        {/* Hero */}
        <section className="bg-emerald-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-transparent" />
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-400/10 rounded-full blur-[100px]" />
          <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative z-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white text-xs font-bold uppercase tracking-widest transition-all mb-8 group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={10} /> Back to Marketplace
            </Link>
            <img src="/logo.png" alt="Nguzza" className="h-20 w-20 rounded-2xl mx-auto mb-6 shadow-xl" />
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 text-balance">
              About Nguzza
            </h1>
            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed font-medium">
              Uganda's local agricultural marketplace, built to connect farmers, buyers, and service providers across the country.
            </p>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium border border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
            {STATS.map((stat) => (
              <div key={stat.label} className="py-6 sm:py-8 text-center px-2">
                <stat.icon className="text-emerald-600 text-xl mx-auto mb-2" />
                <p className="text-lg sm:text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium">
              To empower smallholder farmers and agribusinesses with a trusted, localized marketplace that increases market access, transparency and convenience for all agricultural actors across Uganda.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-400 rounded-full" />
            What We Offer
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES_INFO.map((cat) => (
              <div key={cat.name} className={`${cat.color} border rounded-2xl p-4 sm:p-5 text-center transition-all hover:shadow-md`}>
                <cat.icon className="text-2xl sm:text-3xl mx-auto mb-3" />
                <h3 className="font-black text-gray-900 text-sm mb-1">{cat.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-snug">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-emerald-900 rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-[80px]" />
            <h2 className="text-xl sm:text-2xl font-black mb-4 relative z-10">Why Choose Nguzza?</h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl relative z-10 font-medium">
              We focus exclusively on agriculture, so our search, filters and field types are tailored to farming needs. Listings are localized, moderated by admins, and built to help you transact with confidence.
            </p>
            <Link to="/search" className="btn-accent mt-6 inline-flex relative z-10">
              Browse Marketplace
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-5xl mx-auto px-4 pb-12 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Need help? Reach us at{" "}
            <a href="mailto:ngzdmn@gmail.com" className="text-emerald-600 font-bold hover:underline">ngzdmn@gmail.com</a>
          </p>
        </section>
      </main>
    </>
  );
};

export default About;
