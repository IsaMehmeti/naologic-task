import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { LangChainService } from "./langchain.service";

@Module({
    providers: [LangChainService],
    exports: [LangChainService],
})
export class LangchainModule { }