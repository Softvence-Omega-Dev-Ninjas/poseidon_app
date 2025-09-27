import { BadRequestException, Injectable } from "@nestjs/common";
import { Roles } from "generated/prisma";
import { PrismaService } from "src/prisma-client/prisma-client.service";

@Injectable()
export class EntertainerService {
  constructor(private readonly prisma: PrismaService ) {}

//   Get all entertainer or supporters...
  async getAllEntertainer(userId:string){
    const user = await this.prisma.user.findUnique({where:{id:userId}})
    if(!userId){
        throw new BadRequestException("Sorry Unauthorized Access")
    }
     return await this.prisma.user.findMany({
        where:{role:Roles.supporter},
        select:{
            id:true,
            profile:{
                select:{
                    name:true,
                    image:true,
                    description:true
                }
            }
        }
     })
  }
//   Get entertainer or supporters by id...
  async getEntertainer(userId:string, supporterId:string){
    const user = await this.prisma.user.findUnique({where:{id:userId}})
    if(!userId){
        throw new BadRequestException("Sorry Unauthorized Access")
    }
    
    return await this.prisma.user.findUnique({
        where:{id:supporterId, role:Roles.supporter},
        include:{profile: true}
    })

  }



}