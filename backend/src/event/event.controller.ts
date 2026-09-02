import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { EventService } from './event.service';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import type { EventResponseDto } from './dto/event-response.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto): EventResponseDto {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll(): EventResponseDto[] {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): EventResponseDto { 
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): EventResponseDto {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.eventService.remove(id);
  }
}
