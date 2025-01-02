Для новоприбывших:

- npm install
- npm run start:dev

Сервер запустится.

src/
├── common/         - тут находятся чаще всего используемые плагины или шаблоны
│   ├── guards/     - гварды, чаще всего для проверки jwt
│   ├── middleware/ - мидлвары
│   └── utils/      - утилиты, или же шаблоны. 
├── core/           - ядро сервера
│   ├── database/   - все что связано с базой данных
│   │   ├── prisma.module.ts   - связывает призму с основным модулем
│   │   └── prisma.service.ts  - сама призма
│   └── keys/                  - ключи
│       ├── cookie.settings.ts - общие настройки всех куки
│       ├── jwt.service.ts     - тут создаются и проверяются куки
│       ├── jwt.settings.ts    - общие настройки для всех jwt токенов
│       └── jwt.strategy.ts    - стратегия jwt (не используется)
├── modules/                   - основные модули, которые выполняют все запросы
│   ├── auth/                  - авторизация. Логин/Регистрация и получения cookie/jwt
│   │   ├── auth.controller.ts - auth/.  /login, /register, /preregister @Post
│   │   ├── auth.dto.ts        - dto для регистрации логина и пререгистрации
│   │   ├── auth.module.ts     - ядро 
│   │   └── auth.service.ts    - для добавления в базу данных и проверка
│   ├── posts/                 - посты  
│   │   ├── editor/            - эдитор для публикации поста
│   │   │   ├── editor.controller.ts - editor/.  @Post
│   │   │   ├── editor.dto.ts        - dto для создания поста  
│   │   │   ├── editor.module.ts     - ядро
│   │   │   └── editor.service.ts    - для добавления в базу данных
│   │   ├── posts.controller.ts      - feed/.  @Get   
│   │   ├── posts.dto.ts             - dto для тэгов и типа запрашиваемого поста   
│   │   ├── posts.module.ts          - ядро   
│   │   └── posts.service.ts         - для получения постов из БД. (Исправьте алгоритмы) 
│   └── profile/                     - профиль человека       
│       ├── blacklist/               - черный список. (Пока не для чего)   
│       │   ├── blacklist.controller.ts - profile/blacklist/. @Get, @Post, @Put, @Delete
│       │   ├── blacklist.dto.ts        - dto для проверки айди против кого блокировка
│       │   ├── blacklist.module.ts     - ядро
│       │   └── blacklist.service.ts    - добавить/удалить/изменить/удалить всех из списка
│       ├── profile.controller.ts    - profile/. @Get
│       ├── profile.module.ts        - ядро   
│       └── profile.service.ts       - Получает профиль из БД
├── app.module.ts   - где начинается сервер. (там же и ее настройки)
└── main.ts         - ядро сервера. Управляет всеми ядрами модулей