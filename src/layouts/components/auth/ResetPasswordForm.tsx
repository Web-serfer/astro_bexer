import axios from "axios";
import React, { useState, useEffect } from "react";

// --- УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---
// Примечание: Эти утилиты дублируются из первого файла. В будущем их можно вынести в отдельный файл.
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

type StatusState = {
  message: string | null;
  error: string | null;
};

function SubmitButton({ pending, text }: { pending: boolean; text: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full p-3 text-white rounded-md text-base transition-colors ${
        pending
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
      }`}
    >
      {pending ? "Обработка..." : text}
    </button>
  );
}

// --- КОМПОНЕНТ 2: ФОРМА УСТАНОВКИ НОВОГО ПАРОЛЯ ---
export function ResetPasswordForm() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    message: null,
    error: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const errorFromUrl = params.get("error");

    if (errorFromUrl) {
      setTokenError(
        "Ссылка для сброса недействительна или срок ее действия истек.",
      );
    } else if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenError(
        "Токен для сброса пароля не найден. Пожалуйста, запросите новую ссылку.",
      );
    }
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        window.location.href = "/sign-in";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setStatus({ message: null, error: null });

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/reset-password", {
        token: token,
        newPassword: newPassword,
      });

      setStatus({
        message: "Пароль успешно сброшен! Перенаправляем на страницу входа...",
        error: null,
      });
    } catch (error) {
      setStatus({
        message: null,
        error:
          "Не удалось сбросить пароль. Возможно, ссылка устарела или уже была использована. Попробуйте снова.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
    return (
      <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl mb-5 text-gray-800 font-bold">Ошибка</h2>
        <p className="p-3 rounded-md text-sm text-red-700 bg-red-100 border border-red-200">
          {tokenError}
        </p>
        <a
          href="/forget-password"
          className="inline-block mt-6 text-sm text-blue-600 hover:underline"
        >
          Запросить новую ссылку
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full text-center">
      <h2 className="text-2xl mb-5 text-gray-800 font-bold">Сброс пароля</h2>

      {status.message ? (
        <p className="p-3 rounded-md text-sm text-green-700 bg-green-100 border border-green-200">
          {status.message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="newPassword"
              className="block mb-2 font-medium text-gray-800 text-left"
            >
              Новый пароль
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Введите новый пароль (минимум 8 символов)"
              required
              minLength={8}
              className="w-full p-3 border border-gray-300 rounded-md text-base"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 font-medium text-gray-800 text-left"
            >
              Подтвердите пароль
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Подтвердите новый пароль"
              required
              minLength={8}
              className="w-full p-3 border border-gray-300 rounded-md text-base"
              onChange={() => setPasswordsMatch(true)}
            />
          </div>

          {!passwordsMatch && (
            <p className="text-red-500 text-sm -mt-3 text-left">
              Пароли не совпадают
            </p>
          )}
          {status.error && (
            <p className="p-3 rounded-md text-sm text-red-700 bg-red-100 border border-red-200">
              {status.error}
            </p>
          )}

          <SubmitButton pending={isSubmitting} text="Сбросить пароль" />
        </form>
      )}
    </div>
  );
}
