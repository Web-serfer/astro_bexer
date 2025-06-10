import axios from "axios";
import React, { useState } from "react";

// --- УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---
// Примечание: Эти утилиты дублируются во втором файле. В будущем их можно вынести в отдельный файл.
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

// --- КОМПОНЕНТ 1: ФОРМА ЗАПРОСА ССЫЛКИ НА СБРОС ---
export function ForgetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    message: null,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: null, error: null });

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const redirectTo = `${window.location.origin}/reset-password`;

    try {
      await axios.post("/api/auth/forget-password", {
        email,
        redirectTo,
      });
      setStatus({
        message:
          "Если аккаунт с таким email существует, мы отправили на него ссылку для сброса пароля.",
        error: null,
      });
    } catch (error) {
      console.error("Ошибка при запросе сброса пароля:", error);
      // В целях безопасности показываем то же сообщение, что и при успехе
      setStatus({
        message:
          "Если аккаунт с таким email существует, мы отправили на него ссылку для сброса пароля.",
        error: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full text-center">
      <h2 className="text-2xl mb-5 text-gray-800 font-bold">
        Восстановление пароля
      </h2>

      {status.message ? (
        <p className="p-3 rounded-md text-sm text-green-700 bg-green-100 border border-green-200">
          {status.message}
        </p>
      ) : (
        <>
          <p className="mb-7 text-gray-600 text-sm">
            Введите ваш email, чтобы получить ссылку для сброса пароля.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-800 text-left"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
                className="w-full p-3 border border-gray-300 rounded-md text-base"
              />
            </div>

            {status.error && (
              <p className="p-3 rounded-md text-sm text-red-700 bg-red-100 border border-red-200">
                {status.error}
              </p>
            )}
            <SubmitButton pending={isSubmitting} text="Отправить ссылку" />
          </form>
        </>
      )}
      <a
        href="/sign-in"
        className="inline-block mt-6 text-sm text-blue-600 hover:underline"
      >
        Вернуться ко входу
      </a>
    </div>
  );
}
