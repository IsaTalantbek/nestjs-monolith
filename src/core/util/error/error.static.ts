export const errorStatic = (error, reply, req, message?) => {
    const date = new Date()
    console.error(error)
    console.error(req)
    console.error(date)
    return reply.status(500).send({
        message:
            message ||
            'Возникла ошибка при попытке получить какие-то данные, пожалуйста сообщите нам подробности если вам это помешало',
        path: req.url,
        method: req.method,
        date: date,
    })
}
