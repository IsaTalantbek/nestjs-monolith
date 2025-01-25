export const errorStatic = (error, reply, req, message?) => {
    const date = new Date().toISOString()
    console.error(error)
    console.error(req)
    console.error(date)
    return reply.status(500).send({
        message:
            message ||
            'Возникла критическая ошибка при попытке получить данные. Пожалуйста, сообщите нам что случилось, если вам это помешало',
        path: req.url,
        method: req.method,
        date: date,
    })
}
