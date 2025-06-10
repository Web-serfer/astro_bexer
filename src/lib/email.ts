// lib/email.ts

/**
 * Шаблон для письма с подтверждением email при регистрации.
 * @param verificationUrl - Ссылка для верификации, сгенерированная better-auth.
 */
export const getVerificationEmailTemplate = (verificationUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; text-align: center;">
      <h1 style="color: #333; margin-top: 0;">Подтверждение email</h1>
      <p style="margin-bottom: 20px; line-height: 1.5;">Пожалуйста, подтвердите ваш email, нажав на кнопку ниже:</p>

      <a href="${verificationUrl}"
        style="display: inline-block; padding: 12px 24px;
        background-color: #4CAF50; color: white;
        text-decoration: none; border-radius: 4px; font-weight: bold; margin-bottom: 20px;">
        Подтвердить email
      </a>

      <p style="margin-top: 20px; color: #777; font-size: 14px;">
        Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.
      </p>
    </div>
  `;
};

/** Тема для письма с подтверждением email. */
export const verificationEmailSubject = "Подтвердите ваш email";

// --- Шаблоны для сброса пароля по ссылке ---

/**
 * Шаблон для письма со ссылкой на сброс пароля.
 * @param resetUrl - Ссылка для сброса, сгенерированная better-auth.
 */
export const getPasswordResetLinkTemplate = (resetUrl: string) => {
  // Добавлено `text-align: center;` в главный div для центрирования всего содержимого
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; text-align: center;">
      <h1 style="color: #333; margin-top: 0;">Сброс пароля</h1>
      <p style="margin-bottom: 20px; line-height: 1.5;">Вы запросили сброс пароля для вашего аккаунта.</p>
      <p style="margin-bottom: 20px; line-height: 1.5;">Пожалуйста, нажмите на кнопку ниже, чтобы сбросить пароль:</p>

      <a href="${resetUrl}"
        style="display: inline-block; padding: 12px 24px;
        background-color: #007bff; color: white;
        text-decoration: none; border-radius: 4px; font-weight: bold; margin-bottom: 20px;">
        Сбросить пароль
      </a>

      <p style="margin-top: 20px; color: #777; font-size: 14px;">
        Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
      </p>
      <p style="margin-top: 10px; color: #777; font-size: 14px;">
        Эта ссылка действительна в течение 1 часа.
      </p>
    </div>
  `;
};

/** Тема для письма со ссылкой на сброс пароля. */
export const passwordResetLinkSubject = "Запрос на сброс пароля";
