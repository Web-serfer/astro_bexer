import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth/auth";

// --- СПИСОК ЗАЩИЩЕННЫХ РОУТОВ ---
// Легко расширять, добавляя новые пути
const protectedRoutes = ["/dashboard"];

export const onRequest = defineMiddleware(async (context, next) => {
  // Этот лог должен появиться при КАЖДОМ запросе (к странице, картинке, api)
  console.log(`\n🚀 MIDDLEWARE EXECUTED for path: ${context.url.pathname}`);

  try {
    const sessionData = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (sessionData) {
      console.log(
        `✅ Session found in middleware for user: ${sessionData.user.email}`,
      );
      context.locals.user = sessionData.user;
      context.locals.session = sessionData.session;
    } else {
      console.log("❌ No session found in middleware.");
      context.locals.user = null;
      context.locals.session = null;
    }
  } catch (e: any) {
    console.error("🔥 ERROR in middleware:", e.message);
    // На случай ошибки все равно обнуляем locals
    context.locals.user = null;
    context.locals.session = null;
  }

  // --- НАЧАЛО БЛОКА ЗАЩИТЫ РОУТОВ ---
  const currentPath = context.url.pathname;
  // Проверяем, начинается ли текущий путь с одного из защищенных роутов
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route),
  );

  // Если роут защищен И пользователя нет в locals (нет сессии)
  if (isProtectedRoute && !context.locals.user) {
    console.log(
      `🚫 UNAUTHORIZED access attempt to ${currentPath}. Redirecting to /sign-in`,
    );
    // Перенаправляем на страницу входа и прерываем выполнение
    // 307 - Temporary Redirect, хороший стандарт для таких случаев
    return context.redirect("/sign-in", 307);
  }
  // --- КОНЕЦ БЛОКА ЗАЩИТЫ РОУТОВ ---

  console.log(
    `➡️  Access GRANTED to ${currentPath}. Middleware finished, passing to next().`,
  );
  return next();
});
