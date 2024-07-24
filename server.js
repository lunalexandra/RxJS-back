import Koa from "koa";
import Router from "koa-router";
import { koaBody } from 'koa-body';
import cors from "@koa/cors";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const app = new Koa();
const router = new Router();
const PORT = 3000;

// Middleware для обработки тела запроса
app.use(koaBody());

// Middleware для разрешения CORS
app.use(cors());

// Обработка ошибок
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
    console.error("Error occurred:", err);
  }
});

// Генерация случайных данных для сообщений
function generateMessages(count = 5) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    messages.push({
      id: faker.datatype.uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(),
      received: Math.floor(faker.date.past().getTime() / 1000), // Timestamp в секундах
    });
  }
  return messages;
}

// Определение маршрута для получения непрочитанных сообщений
router.get("/messages/unread", (ctx) => {
  const messages = generateMessages(); // Генерируем 5 случайных сообщений
  ctx.body = {
    status: "ok",
    timestamp: Math.floor(Date.now() / 1000), // Текущее время в секундах
    messages,
  };
});

// Используем маршрутизатор
app.use(router.routes()).use(router.allowedMethods());

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
