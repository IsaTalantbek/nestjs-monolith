import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module.js'
import { ProfileModule } from './modules/profile/profile.module.js'
import { BlackListModule } from './modules/profile/blacklist/blacklist.module.js'
import { PostsModule } from './modules/posts/posts.module.js'
import { EditorModule } from './modules/posts/editor/editor.module.js'
import { SupportModule } from './modules/support/support.module.js'
import { SubscribeModule } from './modules/profile/subscribe/subscribe.module.js'
import { PrivacyModule } from './modules/profile/privacy/privacy.module.js'
import { FriendModule } from './modules/profile/friend/friend.module.js'
import { SesionModule } from './modules/auth/session/session.module.js'
import { StatsModule } from './modules/posts/stats/stats.module.js'
import { CommentModule } from './modules/posts/comment/comment.module.js'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        ProfileModule,
        BlackListModule,
        PostsModule,
        EditorModule,
        SupportModule,
        SubscribeModule,
        PrivacyModule,
        FriendModule,
        SesionModule,
        StatsModule,
        CommentModule,
    ],
})
export class AppModule {}
