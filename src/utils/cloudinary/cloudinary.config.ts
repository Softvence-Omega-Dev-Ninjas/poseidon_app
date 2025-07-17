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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    cloudinary.config(config);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cloudinary;
  },
  inject: [ConfigService],
};
