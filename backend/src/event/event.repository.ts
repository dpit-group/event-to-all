import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { mapCreateEventDtoToEntity } from './mappers/event.mapper';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = mapCreateEventDtoToEntity(createEventDto);
    return event.save();
  }

  findAllEvents(): Promise<Event[]> {
    return this.eventModel.findAll({ order: [['id', 'ASC']] });
  }

  findEventById(id: number): Promise<Event | null> {
    return this.eventModel.findByPk(id);
  }

  updateEvent(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event | null> {
    return this.eventModel.findByPk(id).then(async (event) => {
      if (!event) {
        return null;
      }

      await event.update({
        ...updateEventDto,
        startDate: updateEventDto.startDate
          ? new Date(updateEventDto.startDate)
          : undefined,
        endDate: updateEventDto.endDate
          ? new Date(updateEventDto.endDate)
          : undefined,
      });
      return event;
    });
  }

  deleteEvent(id: number): Promise<boolean> {
    return this.eventModel
      .destroy({ where: { id } })
      .then((deleted) => deleted > 0);
  }
}
