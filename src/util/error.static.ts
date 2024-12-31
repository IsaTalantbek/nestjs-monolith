export const errorStatic = (reply: any, error: any) => {
    console.error(error)
    return reply
        .status(500)
        .send({ message: 'Произошла ошибка. Сообщите нам подробности', error })
}
