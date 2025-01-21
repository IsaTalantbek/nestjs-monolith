import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth/auth.module.js'
import { ProfileModule } from './profile/profile/profile.module.js'
import { BlackListModule } from './profile/blacklist/blacklist.module.js'
import { PostsModule } from './posts/posts.module.js'
import { EditorModule } from './posts/editor/editor.module.js'
import { SupportModule } from './staff/support/support.module.js'
import { SubscribeModule } from './profile/subscribe/subscribe.module.js'
import { PrivacyModule } from './profile/privacy/privacy.module.js'
import { FriendModule } from './profile/friend/friend.module.js'
import { SesionModule } from './auth/session/session.module.js'
import { StatsModule } from './posts/stats/stats.module.js'
import { CommentModule } from './posts/comment/comment.module.js'
import { AuthPackModule } from '../auth.pack.module.js'

@Module({
    imports: [
        AuthPackModule,
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
export class Modules {}
