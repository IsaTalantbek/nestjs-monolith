export const errorStatic = (error, reply, whereError, message) => {
    console.error(`${whereError}: ${error}`)
    console.error(error)
    console.error(new Date())
    return reply.status(500).send({
        message: `Произошла непредвиденная ошибка при попытке ${message}. Пожалуйста, сообщите нам подробности, если вам это мешает`,
    })
}
