import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'ldapjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
  });

  const options = new DocumentBuilder()
    .setTitle('API de Feriados')
    .setDescription(
      'Listagem e criação de feriados nacionais/estaduais/municipais, dias ponte e pontos facultativos.',
    )
    .setVersion('versão 1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3003);
  const server = createServer();
  server.listen(1389, () => {
    console.log('LDAP server listening at %s', server.url);
  });
}

bootstrap();
