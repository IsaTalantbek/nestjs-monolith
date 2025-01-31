import {
    Route,
    SGM,
    RGM,
} from './src/common/decorators/route/route.decorator.index.js'
import { Change } from './src/common/decorators/change/change.js'

@Controller('controller')
@Route({
    guard: { only: SGM.authorized, role: RGM.admin },
    log: { filename: 'profile', silent: true },
})
export class Controller {
    constructor() {}

    @Get()
    @Change({ guard: { only: SGM.check } })
    async method() {}

    @Put()
    @Change({ log: { filename: 'gg', silent: false } })
    async method2() {}
}

// У guard {

// only - только эти пользователя могут пройти. Например authorized или unauthorized
// А еще, есть SGM.check - он просто проверяет сессию пользователя

// role - только пользователь с этой ролью, или с ролью выше может пройти. Необязательно указывать

// }

// У log: {

// filename - куда записываются логи. По дефолту записывает только ошибки. Необязательно указывать

// silent - Логи ошибок от интерцептора логгер не будут высвечиваться в консоли(запись будет)

// }

// Change - декоратор позволяет менять метаданные, если они отличаются от класса
