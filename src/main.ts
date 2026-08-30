import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.get(AuthService).seedAdminAccess();

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Recreating Pix Logic')
      .setDescription('Pix Logic Docs')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'Authorization',
      )
      .addSecurityRequirements('Authorization')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, {
        operationIdFactory: (_controllerKey, methodKey) => methodKey,
      });
    documentFactory.security = [
      {
        Authorization: [],
      },
    ];
    SwaggerModule.setup('docs', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
