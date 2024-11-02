import { ConfigService } from '@nestjs/config'
import { LoggerModuleAsyncParams } from 'nestjs-pino'
import pino from 'pino'

import multistream = pino.multistream

export const PinoConfig = (): LoggerModuleAsyncParams => ({
  useFactory: (config: ConfigService) => ({
    pinoHttp: [
      {
        // stream: process.stdout,
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          bindings: (bindings) => {
            return {
              ...bindings,
              node_version: process.version,
            }
          },
        },
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: config.get<string>('NODE_ENV') !== 'production' ? 'debug' : 'info',
              options: {
                sync: true,
                singleLine: true,
                colorize: true,
              },
            },
            {
              target: 'pino/file',
              level: 'info',
              options: {
                destination: 'logs/info.log',
                mkdir: true,
              },
            },
            {
              target: 'pino/file',
              level: 'error',
              options: {
                destination: 'logs/error.log',
                mkdir: true,
              },
            },
          ],
        },
      },
      multistream(
        [
          { level: 'debug', stream: process.stdout },
          { level: 'error', stream: process.stderr },
          { level: 'fatal', stream: process.stderr },
        ],
        { dedupe: true },
      ),
    ],
  }),
  inject: [ConfigService],
})
