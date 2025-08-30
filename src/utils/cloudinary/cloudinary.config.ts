import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    const config: ConfigOptions = {
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      api_key: configService.get<string>('CLOUDINARY_API_KEY')!,
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET')!,
    };
    cloudinary.config(config);
    return cloudinary;
  },
  inject: [ConfigService],
};
