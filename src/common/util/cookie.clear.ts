export const clearCookie = (reply, ...args) => {
    args.forEach((cookie) => reply.clearCookie(cookie))
}
