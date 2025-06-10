import React, { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";

import signUpImg from "../../../assets/images//signUpImg.jpg";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface ApiErrorPayload {
  errors?: FormErrors;
  message?: string;
}

// --- КОМПОНЕНТ УСПЕШНОЙ РЕГИСТРАЦИИ ---
const SuccessMessage = () => (
  <div className="text-center">
    <h3 className="text-2xl font-semibold text-green-600 mb-4">
      Регистрация почти завершена!
    </h3>
    <p className="text-gray-600">
      Мы отправили письмо с подтверждением на ваш email. Пожалуйста, проверьте
      свою почту и перейдите по ссылке, чтобы активировать аккаунт.
    </p>
    <a
      href="/sign-in"
      className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:bg-indigo-700 hover:shadow active:translate-y-0 active:shadow-sm"
    >
      Вернуться на страницу входа
    </a>
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ФОРМЫ РЕГИСТРАЦИИ ---
export default function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- ОБРАБОТЧИКИ И ВАЛИДАЦИЯ ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Очищаем ошибку для поля при начале ввода
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Пожалуйста, введите ваше имя.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Неверный формат email.";
    if (formData.password.length < 8)
      newErrors.password = "Пароль должен быть не менее 8 символов.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Пароли не совпадают.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await axios.post("/api/auth/sign-up/email", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setIsSuccess(true);
    } catch (error) {
      let errorMessage: FormErrors = {
        general: "Ошибка сети. Попробуйте снова.",
      };
      if (axios.isAxiosError<ApiErrorPayload>(error)) {
        const serverError = error.response?.data;
        if (serverError?.errors || serverError?.message) {
          errorMessage = serverError.errors || {
            general: serverError.message || "Произошла ошибка на сервере.",
          };
        }
      }
      setErrors(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ХЕЛПЕР ДЛЯ ДИНАМИЧЕСКИХ КЛАССОВ ИНПУТА ---
  const getInputClasses = (fieldName: keyof FormErrors) => {
    const baseClasses =
      "w-full rounded-md border bg-white p-3 px-4 text-base text-gray-800 placeholder:text-gray-400 transition-all duration-150 focus:outline-none";
    const errorClasses =
      "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";
    const normalClasses =
      "border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20";

    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="flex min-h-[700px] w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Левая колонка с формой */}
        <div className="flex flex-1 flex-col border-r border-gray-200 p-6 md:p-12">
          <div className="mx-auto flex w-full max-w-md flex-grow flex-col justify-center text-center">
            {isSuccess ? (
              <SuccessMessage />
            ) : (
              <>
                <p className="mb-8 text-xl text-black font-bold">
                  Создайте аккаунт
                </p>

                {errors.general && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-100 p-3 text-center text-red-700">
                    {errors.general}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 text-left"
                  noValidate
                >
                  {/* Поле Имя */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={getInputClasses("name")}
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Поле Email */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Адрес электронной почты
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={getInputClasses("email")}
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Поле Пароль */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Пароль
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`${getInputClasses("password")} pr-10`}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        aria-label={
                          showPassword ? "Скрыть пароль" : "Показать пароль"
                        }
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible className="h-5 w-5" />
                        ) : (
                          <AiOutlineEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Поле Подтверждение пароля */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Подтвердите пароль
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`${getInputClasses("confirmPassword")} pr-10`}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        aria-label={
                          showConfirmPassword
                            ? "Скрыть подтверждение пароля"
                            : "Показать подтверждение пароля"
                        }
                      >
                        {showConfirmPassword ? (
                          <AiOutlineEyeInvisible className="h-5 w-5" />
                        ) : (
                          <AiOutlineEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Кнопка Зарегистрироваться */}
                  <button
                    type="submit"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:bg-indigo-700 hover:shadow active:translate-y-0 active:shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <ImSpinner8 className="h-5 w-5 animate-spin" />
                        <span>Регистрация...</span>
                      </>
                    ) : (
                      "🧑‍💻 Зарегистрироваться"
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                  Уже есть аккаунт?{" "}
                  <a
                    href="/sign-in"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Войти
                  </a>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Правая колонка с иллюстрацией (скрыта на маленьких экранах) */}
        <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 lg:flex">
          <img
            src={signUpImg.src}
            alt="Иллюстрация процесса регистрации"
            className="h-full w-full max-w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
