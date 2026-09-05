import { BadRequestException, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventService } from './event.service';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import type { EventResponseDto } from './dto/event-response.dto';
import type { Filter } from '../filter/filter';
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto): EventResponseDto {
    return this.eventService.create(createEventDto);
  }
  @Get()
  findAll(@Query() filters: Record<string, string>): EventResponseDto[] {
    const { distance, latitude, longitude, ...simpleFilters } = filters;
    const parsedFilters: Filter[] = (Object.entries(simpleFilters) as [string, string][])
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([criteria, value]) => ({ criteria, value }));

    if (distance !== undefined || latitude !== undefined || longitude !== undefined) {
      const distanceInKm = Number(distance);
      const userLatitude = Number(latitude);
      const userLongitude = Number(longitude);

      if (
        !Number.isFinite(distanceInKm) ||
        !Number.isFinite(userLatitude) ||
        !Number.isFinite(userLongitude)
      ) {
        throw new BadRequestException(
          'distance, latitude and longitude must be valid numbers',
        );
      }

      parsedFilters.push({
        criteria: 'distance',
        value: JSON.stringify({
          latitude: userLatitude,
          longitude: userLongitude,
          maxDistanceKm: distanceInKm,
        }),
      });
    }

    return this.eventService.findAll(parsedFilters);
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
