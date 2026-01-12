import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#FFF5F0] to-[#FFE8DC] dark:from-[#1A0A0A] dark:to-[#0A0A0A] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1E1E1E] p-8 shadow-xl border border-[#E6E6E6] dark:border-[#333333]">
        <h1 className="mb-6 text-center text-3xl font-bold text-[#8B1538] dark:text-[#D4AF37] font-playfair">
          Sign Out
        </h1>
        <p className="mb-8 text-center text-[#666666] dark:text-[#AAAAAA] font-poppins">
          Are you sure you want to sign out?
        </p>

        <button
          onClick={handleSignOut}
          className="w-full rounded-lg bg-gradient-to-r from-[#8B1538] to-[#6B0F28] dark:from-[#D4AF37] dark:to-[#B8941F] px-4 py-3 text-base font-semibold text-white dark:text-black transition-all duration-200 hover:from-[#6B0F28] hover:to-[#4B0818] dark:hover:from-[#B8941F] dark:hover:to-[#9C7E1A] focus:outline-none focus:ring-2 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] focus:ring-offset-2 font-poppins"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
