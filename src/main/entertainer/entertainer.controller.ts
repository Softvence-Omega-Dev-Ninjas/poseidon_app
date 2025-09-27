import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { EntertainerService } from "./entertainer.service";
import { handleRequest } from "src/common/utils/request.handler";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "src/auth/guard/role.enum";
import { Roles } from "src/auth/guard/roles.decorator";



@ApiTags('Entertainer')
@Controller('entertainer')
export class EntertainerController {
    constructor(private readonly entertainer:EntertainerService) { }

    @Get()
    @Roles(Role.User, Role.Supporter)
    async getAllEntertainer(@Req() req: Request) {
        const userId = req['sub']
         return handleRequest(
      () => this.entertainer.getAllEntertainer(userId),
      "Get All Entertainer successfully")
    }
    
    @Get(':supporterId')
    @Roles(Role.User, Role.Supporter)
    async getEntertainer(@Req() req:Request, @Param('supporterId') supporterId: string ){
         const userId = req['sub']
         return handleRequest(
      () => this.entertainer.getEntertainer(userId, supporterId),
      "Get Entertainer successfully")
    }

    


}