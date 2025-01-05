export const errorStatic = (error, reply) => {
    console.error(error)
    reply.status(500).send({
        message:
            'Ошибка при попытке получения данных. Пожалуйста, сообщите нам подробности случившегося',
    })
}
