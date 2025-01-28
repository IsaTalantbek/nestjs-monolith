export const errorMessage = (reply, req, message) => {
    const date = new Date().toISOString()

    return reply.status(500).send({
        message: `Произошла критическая ошибка при попытке ${message}. Пожалуйста, сообщите нам, если вам это мешает`,
        path: req.url,
        method: req.method,
        date: date,
    })
}
