import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const sslEnabled = configService.get<string>('DB_SSL') === 'true';

  const config: any = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_DATABASE', 'crowdfunding'),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('DB_SYNCHRONIZE') !== 'false',
    logging: configService.get<string>('DB_LOGGING') === 'true',
  };

  // Only add SSL if explicitly enabled
  if (sslEnabled) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config as TypeOrmModuleOptions;
};
