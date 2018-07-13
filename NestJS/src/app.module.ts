import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TemplateModule } from './Templates/template.module'
import { MessageModule } from './Messages/message.module'
import { RecipientModule } from './Recipients/recipient.module'
import { EventModule } from './Event/event.module';
import { InboxModule } from './Inbox/inbox.module';

@Module({
  imports: [
    TemplateModule,
    MessageModule,
    RecipientModule,
    InboxModule,
    EventModule,
    TypeOrmModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection) {}
}
