import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CatsModule } from './cat/cat.module';
import { UserModule } from './user/user.module';
import { ValidationExceptionsFilter } from './utils/validationExceptionsFilter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new ValidationExceptionsFilter(httpAdapter))
  
  const config = new DocumentBuilder()
    .setTitle('CRUD example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Objects')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [CatsModule, UserModule],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();  
