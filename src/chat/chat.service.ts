import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "../prisma/primsa.service"
import { AgentService } from "../agent/agent.service"
import express from "express"
import { checkMode } from "../agent/helper/checkmode"
import { modes } from "../agent/type/mode.type"

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService,
        private agent: AgentService
    ) { }

    async newChat(email: string, title: string) {
        try {

            console.log(email, title)
            // if (userInput) {
            //     throw new BadRequestException("userinput is required")
            // }

            if (!email) {
                throw new BadRequestException("email required for start a convo")
            }

            const user = await this.prisma.user.findFirst({
                where: { email }
            })

            if (!user) {
                throw new UnauthorizedException("failed to create convo! user is not found ")
            }

            const userId = user.id
            const chat = await this.prisma.chat.create({
                data: {
                    title,
                    userId
                }
            })

            const userMessage = [
                { role: "user", content: "chat" }
            ];


            await this.prisma.messages.create({
                data: {
                    content: userMessage[0].content,
                    role: "user",
                    chatId: chat.id
                }
            })

            let fullResponse = ""
            for await (const chunk of this.agent.chatStream(userMessage,)) {
                fullResponse = fullResponse + chunk
            }

            await this.prisma.messages.create({
                data: {
                    content: fullResponse,
                    role: "assistant",
                    chatId: chat.id
                }
            })
            return {
                message: "sucessfully create a convo",
                status: 200,
                chat
            }


        } catch (e) {
            return {
                message: "internal server error",
                status: 500,
                error: e.message
            }
        }

    }

    async handleStream(
        message: string,
        chatId: string,
        mode: modes,
        res: express.Response
    ) {
        try {

            await this.prisma.messages.create({
                data: {
                    content: message,
                    role: "user",
                    chatId,
                },
            });


            const lastMessages = await this.prisma.messages.findMany({
                where: { chatId },
                orderBy: { createdAt: "desc" },
                take: 9,
            });

            lastMessages.reverse();


            const history = lastMessages.map((m) => ({
                role: m.role,
                content: m.content,
            }));


            const systemPrompt = checkMode(mode);

            const messages = [
                { role: "system", content: systemPrompt },
                ...history,
                { role: "user", content: message },
            ];

            let fullResponse = "";


            for await (const chunk of this.agent.chatStream(messages)) {

                if (!chunk || chunk.trim() === "") continue;
                fullResponse += chunk;

                res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
                (res as any).flush?.();
            }


            await this.prisma.messages.create({
                data: {
                    content: fullResponse,
                    role: "assistant",
                    chatId,
                },
            });


            res.write("data: [DONE]\n\n");
            res.end();

        } catch (e) {
            res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
            res.end();
        }
    }


    async getChatHistory(chatId: string, userid: string) {

        try {

            const messages = await this.prisma.messages.findMany({
                where: { chatId },
                orderBy: { createdAt: "desc" },
                take: 10

            })

            return messages

        } catch (e) {
            return {
                message: "internal server error",
                status: 500,
                error: e.message
            }
        }

    }


    async getChat(userId: string) {
        try {
            const chat = await this.prisma.chat.findMany({
                where: { userId }
            })
            if(!chat){
                return
            }

            return chat


        } catch (e) {
            return {
                message: "internal server error"
            }
        }
    }
    

    async deleteChat(chatId){
        try {



        }catch(e){
            return e.message
        }
    }

}