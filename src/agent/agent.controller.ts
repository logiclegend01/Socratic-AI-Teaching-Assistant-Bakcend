import { Controller, Post, Body, Res } from "@nestjs/common"
import express from "express"
import { AgentService } from "./agent.service"

@Controller("api/agent")
export class AgentController {
    constructor(private agent: AgentService) { }

    @Post("chat")
    async Chat(@Body() body: { message: string }, @Res() res: express.Response) {
        const { message } = body

        const messages = [
            { role: "system", content: "you are a helpful teacher" },
            { role: "user", content: message }
        ]

        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")
        res.flushHeaders()

        try {
            for await (const chunk of this.agent.chatStream(messages)) {
                const respo = res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`)
                   ;(res as any).flush?.()
                console.log(respo)
            }
            res.write("data: [DONE]\n\n")
        } catch (e) {
            res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`)
        } finally {
            res.end()
        }
    }
}