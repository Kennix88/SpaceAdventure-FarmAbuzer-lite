import { ConfigService } from '@nestjs/config'
import { LoggerModuleAsyncParams } from 'nestjs-pino'

export const PinoConfig = (): LoggerModuleAsyncParams => ({
  useFactory: () => ({
    pinoHttp: {
      level: 'info',
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: {
              destination: 'logs/info.log',
              level: 'info',
              colorize: true,
            },
          },
          {
            target: 'pino-pretty',
            options: {
              destination: 'logs/error.log',
              level: 'error',
              colorize: true,
            },
          },
        ],
      },
    },
  }),
  inject: [ConfigService],
})
