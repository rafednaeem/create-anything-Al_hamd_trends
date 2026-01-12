import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#FFF5F0] to-[#FFE8DC] dark:from-[#1A0A0A] dark:to-[#0A0A0A] p-4">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1E1E1E] p-8 shadow-xl border border-[#E6E6E6] dark:border-[#333333]"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-[#8B1538] dark:text-[#D4AF37] font-playfair">
          Welcome Back
        </h1>
        <p className="mb-8 text-center text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
          Sign in to continue shopping
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white font-poppins">
              Email
            </label>
            <div className="overflow-hidden rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] px-4 py-3 focus-within:border-[#8B1538] dark:focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#8B1538] dark:focus-within:ring-[#D4AF37]">
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-base outline-none text-[#2B2B2B] dark:text-white font-poppins"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2B2B2B] dark:text-white font-poppins">
              Password
            </label>
            <div className="overflow-hidden rounded-lg border border-[#D0D0D0] dark:border-[#404040] bg-white dark:bg-[#262626] px-4 py-3 focus-within:border-[#8B1538] dark:focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#8B1538] dark:focus-within:ring-[#D4AF37]">
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-transparent text-base outline-none text-[#2B2B2B] dark:text-white font-poppins"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-[#FFF0F0] dark:bg-[#2A1818] p-3 text-sm text-[#CC0000] dark:text-[#FF6666] border border-[#FFCCCC] dark:border-[#442222] font-poppins">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#8B1538] to-[#6B0F28] dark:from-[#D4AF37] dark:to-[#B8941F] px-4 py-3 text-base font-semibold text-white dark:text-black transition-all duration-200 hover:from-[#6B0F28] hover:to-[#4B0818] dark:hover:from-[#B8941F] dark:hover:to-[#9C7E1A] focus:outline-none focus:ring-2 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-50 font-poppins"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-[#666666] dark:text-[#AAAAAA] font-poppins">
            Don't have an account?{" "}
            <a
              href={`/account/signup${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-[#8B1538] dark:text-[#D4AF37] hover:text-[#6B0F28] dark:hover:text-[#B8941F] font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
