export const jwtAccessSetting = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
}

export const jwtRefreshSetting = {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
}

export const jwtAccessSecret = {
    secret: process.env.JWT_SECRET,
}

export const jwtRefreshSecret = {
    secret: process.env.JWT_REFRESH_SECRET,
}

export const jwtAccesExpire = {
    expiresIn: '1h',
}
export const jwtRefreshExpire = {
    expiresIn: '7d',
}

export const jwtAccessData = (user) => {
    return {
        userId: user.id,
        username: user.username,
        profileId: user.profileId,
    }
}

export const jwtRefreshData = (user) => {
    return {
        userId: user.id,
    }
}
