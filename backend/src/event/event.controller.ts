import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import type { EventResponseDto } from './dto/event-response.dto';
import type { Filter } from '../filter/filter';

type FilterRequest = Filter[] | { filters: Filter[] };

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventResponseDto> {
    return await this.eventService.create(createEventDto);
  }

  @Post('filters')
  findEventsByFilterBody(@Body() body: FilterRequest): EventResponseDto[] {
    const filters = Array.isArray(body) ? body : body?.filters;

    if (
      !Array.isArray(filters) ||
      filters.some(
        (filter) =>
          !filter ||
          typeof filter.criteria !== 'string' ||
          typeof filter.value !== 'string',
      )
    ) {
      throw new BadRequestException(
        'Body must contain filters with criteria and value strings',
      );
    }

    return this.eventService.findEventbyFilters(filters);
  }

  @Get(['', 'filters'])
  findEventsByFilters(
    @Query() filters: Record<string, string>,
  ): EventResponseDto[] {
    const { distance, latitude, longitude, ...simpleFilters } = filters;

    const parsedFilters: Filter[] = Object.entries(simpleFilters)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([criteria, value]) => ({
        criteria,
        value,
      }));

    if (
      distance !== undefined ||
      latitude !== undefined ||
      longitude !== undefined
    ) {
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

    return this.eventService.findEventbyFilters(parsedFilters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): EventResponseDto {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): EventResponseDto {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return this.eventService.remove(id);
  }
}
