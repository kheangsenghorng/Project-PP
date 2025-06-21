"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { signup, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Check passwords again ");
      return;
    }
    await signup(firstname, lastname, phonenumber, email, password);
    router.push("/verify-email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Create an account!
        </h1>
        <p className="text-sm text-center mb-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name *</Label>
              <div className="relative">
                <User className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="firstname"
                  type="text"
                  placeholder="First name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name *</Label>
              <div className="relative">
                <User className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phonenumber">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="phonenumber"
                type="tel"
                placeholder="Phone number"
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Lock className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Password mismatch error message */}
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          {/* Remember Me */}
          <div className="flex justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 mr-2"
              />
              Remember me
            </label>
            <a href="/forgot-password" className="text-blue-500 underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-4 text-gray-500">or continue with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Login - Responsive */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Button
            className="flex-1 bg-gray-200 shadow-sm text-black flex items-center justify-center space-x-1 hover:bg-gray-300"
            onClick={handleGoogleLogin}
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            <span>Google</span>
          </Button>
          <Button
            className="flex-1 bg-gray-200 shadow-sm text-black flex items-center justify-center space-x-1 hover:bg-gray-300"
            onClick={handleFacebookLogin}
          >
            <img src="/facebook.png" alt="Facebook" className="w-8 h-8" />
            <span>Facebook</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
