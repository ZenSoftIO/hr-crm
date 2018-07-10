import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Message } from './message.entity';
import { acceleratedmobilepageurl } from 'googleapis/build/src/apis/acceleratedmobilepageurl';
import { Recipient } from 'Recipients/recipient.entity';
import { RecipientService } from 'Recipients/recipient.service';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>) {}


  async create(message: Message): Promise<number> {
    let messageToDatabase = {
      "subject": message.subject,
      "content" : message.content,
      "template" : message.template
    }
    let response;
    try{
       response = await this.messageRepository.save(messageToDatabase)
    }
    catch(err){
      messageToDatabase.template = null;
      response = await this.messageRepository.save(messageToDatabase);
    }
    return await JSON.stringify(response.id)
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findByRecipient(recipientEmail: string): Promise<Message[]> {
    const myMessages = await this.messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.recipients", "recipient")
    .where("recipient.email = :email", { email: recipientEmail })
    .getMany()
    return myMessages;
  }

  async findOne(int: number): Promise<Message> {
    return await this.messageRepository.findOne({id: int});
  }

  async deleteOne(int: number): Promise<Message> {
    try {
        const toDelete = this.messageRepository.findOne({id: int});
        await this.messageRepository.delete({id: int});
        return toDelete;
    } catch (e) {
      console.log(e);
    }
  }
}
