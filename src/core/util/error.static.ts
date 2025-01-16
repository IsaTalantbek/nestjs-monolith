export const errorStatic = (error, reply, whereError, message) => {
    console.error(`${whereError}: ${error}`)
    return reply.status(500).send({
        message: `Произошла непредвиденная ошибка при попытке ${message}. Пожалуйста, сообщите нам подробности, если вам это мешает`,
    })
}
