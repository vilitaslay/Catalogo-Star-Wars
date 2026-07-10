import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return [
      ' ____ _____  _    ____   __        ___    ____  ____  ',
      '/ ___|_   _|/ \\  |  _ \\  \\ \\      / / \\  |  _ \\/ ___| ',
      '\\___ \\ | | / _ \\ | |_) |  \\ \\ /\\ / / _ \\ | |_) \\___ \\ ',
      ' ___) || |/ ___ \\|  _ <    \\ V  V / ___ \\|  _ < ___) |',
      '|____/ |_/_/   \\_\\_| \\_\\    \\_/\\_/_/   \\_\\_| \\_\\____/ ',
      '',
      'Catálogo de Star Wars — backend en NestJS, corriendo lejos, muy lejos.',
      '',
      'Documentación interactiva en /docs',
    ].join('\n');
  }
}