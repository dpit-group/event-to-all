import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage: 'resources/database/event-to-all.db',
  autoLoadModels: true,
  synchronize: false,
};