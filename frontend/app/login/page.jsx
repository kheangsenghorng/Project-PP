"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rejectedTime, setRejectedTime] = useState(null);
  const router = useRouter();
  const { login, updateUserStatus } = useAuthStore();

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Check account status
      if (user.status === "rejected") {
        // Store rejection time
        const rejectionTime = new Date();
        localStorage.setItem("rejectedTime", rejectionTime);
        setRejectedTime(rejectionTime);

        throw new Error(
          "Your account has been rejected. Please try again after."
        );
      } else if (user.status !== "approved") {
        throw new Error(
          `Your account is ${user.status}. Please wait for approval.`
        );
      }

      setShowSuccessModal(true);

      setTimeout(() => {
        const { role, id } = user;

        if (!role || !id) {
          throw new Error("Missing user information");
        }

        if (role === "admin") {
          router.push(`/admin/${id}/dashboard`);
        } else {
          router.push(`/profile/${id}/myprofile`);
        }
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Login Successful!
            </h2>
            <p className="text-gray-600">You are being redirected...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Welcome Back!
        </h1>
        <p className="text-sm text-center mb-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Register
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">or continue with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleGoogleLogin}
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            <span>Google</span>
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleFacebookLogin}
          >
            <img src="/facebook.png" alt="Facebook" className="w-5 h-5" />
            <span>Facebook</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
