import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CatsModule } from './cat/cat.module';
import { UserModule } from './user/user.module';
import { ValidationExceptionsFilter } from './utils/validationExceptionsFilter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  const swaggerDocument = generateSwaggerDocument(app)
  SwaggerModule.setup('api', app, swaggerDocument);

  app.enableCors();
  app.useGlobalFilters(new ValidationExceptionsFilter(httpAdapter))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(3000);
}

function generateSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('CRUD example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Objects')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [CatsModule, UserModule],
  });

  return document;
}


bootstrap();  


