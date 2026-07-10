import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())

   const config = new DocumentBuilder()
    .setTitle('Star Wars Catalogue API')
    .setDescription('Backend NestJs — Conexa')
    .setVersion('1.0')
    .addBearerAuth() // this is what lets Swagger UI send JWT tokens
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // → available at localhost:3000/docs





  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
