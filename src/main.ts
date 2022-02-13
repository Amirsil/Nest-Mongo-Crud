import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CatsModule } from './cat/cat.module';
import { UserModule } from './user/user.module';
import { ValidationExceptionsFilter } from './utils/validationExceptionsFilter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  app.enableCors();
  configureSwagger(app)
  app.useGlobalFilters(new ValidationExceptionsFilter(httpAdapter))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(3000);
}

function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Basic CRUD')
    .setDescription('CRUD API for users and cats')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    include: [CatsModule, UserModule],
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
}


bootstrap();


