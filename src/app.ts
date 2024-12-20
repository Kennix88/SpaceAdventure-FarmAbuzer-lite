import { middleware } from '@app/app.middleware'
import { genReqId } from '@app/shared/utils/genReqId.util'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap(): Promise<string> {
  const isProduction = process.env['NODE_ENV'] === 'production'

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: isProduction,
      // Fastify has pino built in, but it use nestjs-pino, so we disable the logger.
      logger: false,
      genReqId,
    }),
    {
      bufferLogs: true,
    },
  )

  app.useLogger(app.get(PinoLogger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  // Fastify Middleware
  await middleware(app)

  app.enableShutdownHooks()
  await app.listen(process.env['PORT_API'] || 3000)

  return app.getUrl()
}

void (async () => {
  try {
    await bootstrap()
    Logger.log(
      `Started on: ${process.env['PROTOCOL']}://${process.env['DOMAIN']}:${process.env['PORT_API']}`,
      'Bootstrap',
    )
  } catch (error) {
    Logger.error(error, 'Bootstrap')
  }
})()
