import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { Event } from './entities/event.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [EventController],
  providers: [EventService, EventRepository],
  imports: [SequelizeModule.forFeature([Event])],
})
export class EventModule {}
