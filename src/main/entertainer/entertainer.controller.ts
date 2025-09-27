import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { EntertainerService } from "./entertainer.service";
import { handleRequest } from "src/common/utils/request.handler";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "src/auth/guard/role.enum";
import { Roles } from "src/auth/guard/roles.decorator";



@ApiTags('Entertainer')
@Controller('entertainer')
export class EntertainerController {
    constructor(private readonly entertainer: EntertainerService) { }

    // get all entertainer
    @Get()
    @Roles(Role.User, Role.Supporter)
    async getAllEntertainer(@Req() req: Request) {
        const userId = req['sub']
        return handleRequest(
            () => this.entertainer.getAllEntertainer(userId),
            "Get All Entertainer successfully")
    }
    // get a entertainer
    @Get(':supporterId')
    @Roles(Role.User, Role.Supporter)
    async getEntertainer(@Req() req: Request, @Param('supporterId') supporterId: string) {
        const userId = req['sub']
        return handleRequest(
            () => this.entertainer.getEntertainer(userId, supporterId),
            "Get Entertainer successfully")
    }

    // create follower..
    // @Post(':supporterId')
    // @Roles(Role.User, Role.Supporter)
    // async follow(@Req() req:Request)







}