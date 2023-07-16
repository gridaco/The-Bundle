import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { SessionsModule } from './sessions/sessions.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [TemplatesModule, SessionsModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
