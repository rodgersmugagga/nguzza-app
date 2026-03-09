import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { validateSignIn } from "../utils/validation";
import { FaPhoneAlt, FaLock, FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignIn() {
  const [formData, setFormData] = React.useState({ phoneNumber: "", password: "" });
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState([]);
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading } = useSelector((state) => state.user);

  // Handle OAuth error redirects (e.g. failed Google sign-in)
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      const msgs = {
        google_auth_failed: 'Google sign-in failed. Please try again.',
        auth_failed: 'Authentication failed. Please try again.',
        data_parse_error: 'An error occurred processing your sign-in.',
        missing_auth_data: 'Sign-in was incomplete. Please try again.',
        server_error: 'A server error occurred. Please try again later.',
        timeout: 'Sign-in timed out. Please try again.',
      };
      setErrors([msgs[error] || 'Sign-in failed. Please try again.']);
      window.history.replaceState({}, '', '/sign-in');
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignIn(formData.phoneNumber, formData.password);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(signInStart());
    setMessage("");
    setErrors([]);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        dispatch(signInFailure(data.message || "Login failed!"));
        setErrors([data.message || "Login failed!"]);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      setErrors(["Network error: " + error.message]);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | Nguzza - Uganda's Agriculture Marketplace</title>
        <meta name="description" content="Sign in to your Nguzza account to manage your agriculture listings and connect with buyers." />
      </Helmet>

      <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fafbfc] py-12 px-4">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-color-primary/5 to-transparent z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-color-primary/10 rounded-full blur-3xl hidden sm:block" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-200/20 rounded-full blur-3xl hidden sm:block" />

        <div className="w-full max-w-md relative z-10">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-color-primary text-xs font-bold uppercase tracking-widest transition-all mb-8 group pl-2">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
          </Link>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-color-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-color-primary text-2xl" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-400 font-medium">Continue your journey with Nguzza</p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center gap-3 font-bold text-sm">
                <FaCheckCircle className="text-lg" /> {message}
              </div>
            )}

            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl space-y-1">
                {errors.map((error, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-bold text-sm">
                    <FaExclamationCircle className="text-red-400" /> {error}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Phone Number</label>
                <div className="relative group">
                  <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-color-primary transition-colors" />
                  <input
                    type="tel"
                    placeholder="0765XXXXXX"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-100 bg-gray-50/50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary outline-none font-bold text-gray-700 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Password</label>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-color-primary transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-100 bg-gray-50/50 p-4 pl-12 pr-12 rounded-2xl focus:ring-2 focus:ring-color-primary/20 focus:border-color-primary outline-none font-bold text-gray-700 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-color-primary text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-color-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In to Account"
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-4 text-gray-400 font-black tracking-[0.2em]">Or continue with</span></div>
              </div>

              <OAuth mode="signin" />
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-400 text-sm font-bold">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-color-primary hover:underline ml-1">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

