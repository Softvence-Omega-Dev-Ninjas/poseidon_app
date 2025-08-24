import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Req,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { UpdateservicesDto } from './dto/update-serviecs';
import { CreateServiceOrderDto } from './dto/create-serviesorder';
import { ServiceService } from './services.service';
import { CreateServicesDto } from './dto/create-services';
import { Public } from 'src/auth/guard/public.decorator';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Roles(Role.Supporter)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createProductDto: CreateServicesDto,
    @Req() req,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    console.log('Files received:', createProductDto);

    const { ...restOfProductData } = createProductDto;
    return this.serviceService.create(createProductDto, req.sub, files);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Public()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'draft', required: false, type: Boolean })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('draft') draft?: boolean,
  ) {
    return this.serviceService.findAll(page, limit, draft);
  }

  @Roles(Role.Supporter)
  @Get('getallservices')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'draft', required: false, type: Boolean })
  findAllByUser(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('draft') draft?: boolean,
  ) {
    return this.serviceService.findAllUser(req.sub, page, limit, draft);
  }

  @Post('/createOrder')
  @Roles(Role.Supporter)
  @ApiOperation({ summary: 'Create a new service order' })
  async createOrder(@Body() dto: CreateServiceOrderDto) {
    return this.serviceService.createOrder(dto);
  }

  @Get('/getallservicesOrder')
  @Roles(Role.Supporter)
  @ApiOperation({ summary: 'Get all service orders with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAllOrder(@Query('page') page = 1, @Query('limit') limit = 10) {
    const take = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (Number(page) - 1) * take;

    return this.serviceService.findAllOrder({ skip, take });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Get('/servicesorder:id')
  @ApiOperation({ summary: 'Get a single service order by ID' })
  async findSingle(@Param('id') id: string) {
    return this.serviceService.findSingle(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single service by ID' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('newImages'))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateservicesDto,
    @UploadedFiles() newImages?: Express.Multer.File[],
  ) {
    return this.serviceService.update(id, dto, newImages);
  }
}
