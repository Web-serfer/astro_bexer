import React, { useState, useEffect } from "react";
import axios from "axios";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaVk } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

import signInImg from "../../../assets/images/signInImg.jpg";

interface ApiError {
  message?: string;
  error?: string;
}

const getErrorMessage = (error: unknown): string => {
  const defaultMessage = "Произошла неизвестная ошибка. Попробуйте снова.";
  if (axios.isAxiosError<ApiError>(error)) {
    const serverError = error.response?.data;
    return serverError?.message || serverError?.error || error.message;
  }
  if (error instanceof Error) return error.message;
  return defaultMessage;
};

// SVG-иконка Google, так как ее нет в react-icons
const GoogleIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function SignInForm({
  dashboardPath = "/dashboard",
}: {
  dashboardPath?: string;
}) {
  // --- ЛОГИКА И СОСТОЯНИЕ (из вашего образца) ---
  const { data: session, isPending: isSessionLoading } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVkLoading, setIsVkLoading] = useState(false);

  useEffect(() => {
    if (session) {
      window.location.href = dashboardPath;
    }
  }, [session, dashboardPath]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("remember-me") === "on";
    try {
      await authClient.signIn.email({ email, password, rememberMe });
      window.location.href = dashboardPath;
    } catch (error) {
      setFormErrors({ general: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "vk") => {
    if (provider === "google") setIsGoogleLoading(true);
    if (provider === "vk") setIsVkLoading(true);
    setFormErrors({});
    try {
      await authClient.signIn.social({ provider });
    } catch (error) {
      setFormErrors({ general: getErrorMessage(error) });
      if (provider === "google") setIsGoogleLoading(false);
      if (provider === "vk") setIsVkLoading(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <ImSpinner8 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="flex min-h-[700px] w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Левая колонка с формой */}
        <div className="flex flex-1 flex-col border-r border-gray-200 p-2 md:p-12">
          <div className="mx-auto flex w-full max-w-sm flex-grow flex-col justify-center text-center">
            <p className="mb-2 text-xl text-black font-bold">Вход в аккаунт</p>

            {formErrors.general && (
              <div className="mt-6 rounded-md border border-red-200 bg-red-100 p-3 text-sm font-medium text-red-800">
                {formErrors.general}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email */}
                <div className="text-left">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Адрес электронной почты
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="you@email.com"
                  />
                </div>
                {/* Password */}
                <div className="text-left">
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md border-gray-300 p-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    name="remember-me"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Запомнить меня</span>
                </label>
                <a
                  href="/forget-password"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Забыли пароль?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <ImSpinner8 className="h-5 w-5 animate-spin" />
                ) : (
                  "🔐 Войти"
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-400">
                  или войти с помощью
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={isGoogleLoading || isVkLoading || isSubmitting}
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGoogleLoading ? (
                  <ImSpinner8 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <GoogleIcon /> Google
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignIn("vk")}
                disabled={isVkLoading || isGoogleLoading || isSubmitting}
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-transparent bg-[#0077FF] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#006fef] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isVkLoading ? (
                  <ImSpinner8 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <FaVk className="h-5 w-5" /> ВКонтакте
                  </>
                )}
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Нет аккаунта?{" "}
              <a
                href="/sign-up"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Зарегистрироваться
              </a>
            </p>
          </div>
        </div>

        {/* Правая колонка с иллюстрацией */}
        <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200 lg:flex">
          <img
            src={signInImg.src}
            alt="Иллюстрация для страницы входа"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
