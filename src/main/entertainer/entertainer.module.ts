import { Module } from "@nestjs/common";
import { EntertainerController } from "./entertainer.controller";
import { EntertainerService } from "./entertainer.service";


@Module({
    controllers: [EntertainerController],
    providers: [EntertainerService],

})
export class EntertainerModule { }