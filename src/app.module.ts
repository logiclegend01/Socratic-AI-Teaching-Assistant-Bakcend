import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module"
import {ConfigModule} from "@nestjs/config"
import {EnvModule} from "./config/env/env.module"
import {AuthModule} from "./auth/auth.module"
import {AgentModule} from "./agent/agent.module"

@Module({
  imports: [PrismaModule,ConfigModule,EnvModule,AuthModule,AgentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
