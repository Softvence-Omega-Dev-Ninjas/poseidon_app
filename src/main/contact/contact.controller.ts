import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Roles(Role.Admin)
  @Get('get-all')
  findAll() {
    return this.contactService.findAll();
  }

  @Roles(Role.Admin)
  @Get('see/:id')
  findOne(@Param('id') id: string) {
    return this.contactService.seeUpdate(id);
  }
}
