export const cookieClear = (reply: any) => {
    reply.clearCookie('aAuthToken')
    reply.clearCookie('rAuthToken')
    return
}
