import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { SessionsModule } from './sessions/sessions.module';
import { TemplatesModule } from './templates/templates.module';
import { UtilitysModule } from './utility/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TemplatesModule,
    SessionsModule,
    FilesModule,
    UtilitysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
