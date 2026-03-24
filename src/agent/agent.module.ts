import {Module} from "@nestjs/common"
import {AgentController} from "./agent.controller"
import {ModelService} from "./model/model.service"
import {AgentService} from './agent.service'

@Module({
    providers : [ModelService,AgentService],
    controllers :[AgentController]
})

export class AgentModule {}