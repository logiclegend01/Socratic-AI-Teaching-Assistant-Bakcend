import { BadRequestException, Injectable } from "@nestjs/common"
import { ModelService } from "./model/model.service"

@Injectable()
export class AgentService {
    constructor(private model: ModelService) { }

    async *chatStream(messages): AsyncGenerator<string> {
        if (!messages) {
            throw new BadRequestException("message is required to start a convo")
        }

        yield* this.model.chatStream(messages)
    }
}