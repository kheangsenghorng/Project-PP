"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function VerifyEmailPage() {
  const [value, setValue] = useState("");
  const { verifyEmail, isLoading, error } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyEmail(value);
    if (error && !isLoading) {
      toast({
        title: "Email verification failed",
        description: "Your email verification code is incorrect.",
        variant: "destructive",
      });
    }
    if (!error && !isLoading) {
      toast({
        title: "Email verified successfully",
        description: "Your email has been verified. Redirecting to login...",
        variant: "success",
      });
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Verify Your Email
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          We’ve sent a 6-digit code to your email. Please enter it below to
          verify your email address.
        </p>

        {/* OTP Input */}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Feedback Message */}
        <div className="text-center text-sm mb-6">
          {value === "" ? (
            <span className="text-gray-500">Enter your one-time password.</span>
          ) : (
            <span className="text-gray-700">You entered: {value}</span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          disabled={isLoading || value.length < 6}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>

        {/* Error Message */}
        {error && !isLoading && (
          <p className="text-sm text-red-500 text-center mt-4">
            Invalid OTP. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
