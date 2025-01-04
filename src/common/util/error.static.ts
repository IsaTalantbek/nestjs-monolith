export const errorStatic = (error, req) => {
    console.error(error)
    req.status(500).send({
        message:
            'Ошибка при попытке получения данных. Пожалуйста, сообщите нам подробности случившегося',
    })
}
