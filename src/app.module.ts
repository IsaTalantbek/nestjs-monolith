import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { ProfileModule } from './modules/profile/profile.module'
import { BlackListModule } from './modules/profile/blacklist/blacklist.module'
import { PostsModule } from './modules/posts/posts.module'
import { EditorModule } from './modules/posts/editor/editor.module'
import { SupportModule } from './modules/support/support.module'
import { SubscribeModule } from './modules/profile/subscribe/subscribe.module'
import { PrivacyModule } from './modules/profile/privacy/privacy.module'

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
    ],
})
export class AppModule {}
