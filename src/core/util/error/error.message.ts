export const errorMessage = (reply, req, message) => {
    const date = new Date()

    return reply.status(500).send({
        message: `Произошла непредвиденная ошибка при попытке ${message}. Пожалуйста, сообщите нам подробности, если вам это мешает`,
        path: req.url,
        method: req.method,
        date: date,
    })
}
