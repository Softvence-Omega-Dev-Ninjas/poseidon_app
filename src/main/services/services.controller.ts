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
import { ApiTags, ApiConsumes, ApiQuery, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { UpdateservicesDto } from './dto/update-serviecs';
import { CreateServiceOrderDto } from './dto/create-serviesorder';
import { ServiceService } from './services.service';
import { CreateServicesDto, UpdateServiceOrderStatusDto } from './dto/create-services';
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
  async createOrder(@Body() dto: CreateServiceOrderDto,@Req() req:any) {
    req.sub
    return this.serviceService.createOrder(dto,req.sub);
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


    @Get('/getallservicesOrderSingleuser')
  @Roles(Role.Supporter)
  @ApiOperation({ summary: 'Get all service orders with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAllOrderSingleuser(@Req() req:any,@Query('page') page = 1, @Query('limit') limit = 10) {
    const take = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (Number(page) - 1) * take;
    return this.serviceService.findAllOrdeSingleuser(req.sub,{ skip, take });
  }

  @Delete(':id')
  @Roles(Role.Supporter)
  @UsePipes(new ValidationPipe({ transform: true }))
  remove(@Param('id') id: string) {
    console.log(id)
    return this.serviceService.remove(id);
  }

  @Get('/servicesorder:id')
  @ApiOperation({ summary: 'Get a single service order by ID' })
  async findSingle(@Param('id') id: string) {
    return this.serviceService.findSingle(id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a single service by ID' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Supporter)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('newImages'))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateservicesDto,
    @UploadedFiles() newImages?: Express.Multer.File[],
  ) {
       console.log(id, dto)
       console.log(newImages)
    return this.serviceService.update(id, dto, newImages);
  }
  
   @Roles(Role.Supporter)
   @Patch('orders/:orderId/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update the status of a service order' })
  @ApiParam({
    name: 'orderId',
    description: 'The ID of the service order',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateServiceOrderStatusDto,
  ) {
    return this.serviceService.updateOrderStatus(orderId, dto);
  }



  
}
