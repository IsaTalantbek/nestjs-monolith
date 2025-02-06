# 1. Используем официальный образ Node.js
FROM node:22.9.0 AS builder

# 2. Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь исходный код в контейнер
COPY . .

# 6. Собираем приложение
RUN npm run build

# 7. Очищаем зависимости dev (если не нужны)
RUN npm prune --production

# 8. Запускаем продакшн-версию в отдельном этапе
FROM node:22.9.0 AS runner
WORKDIR /app

# 9. Копируем только нужные файлы из предыдущего контейнера
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma 
COPY package.json ./

# 10. Открываем порт (если нужен)
EXPOSE 3000

# 11. Запуск приложения
CMD ["sh", "-c", "npm run db:deploy && npm run start:prod"]

