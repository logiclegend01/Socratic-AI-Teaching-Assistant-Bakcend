import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/primsa.service"
import { comparePassword, hashPassword } from "./helper/password.helper"

export class AuthService {
    constructor(private prisma: PrismaService) { }

    async registerUser(name, username, email, password) {

        try {
            if (!name || !username || !email || !password) {
                throw new BadRequestException('all fields are required')
            }

            const existedUser = await this.prisma.user.findFirst({
                where: { email }
            })

            if (existedUser) {
                return {
                    message: `${email} is already registred`,
                    status: 202
                }
            }

            const hash = await hashPassword(password)

            const user = await this.prisma.user.create({
                data: {
                    name,
                    username,
                    email,
                    password: hash
                }
            })


            return {
                message: `user sucessfly is registred`,
                status: 200,
                user

            }

        } catch (e: any) {
            return {
                message: "internal server error",
                status: 500,
                error: e
            }
        }

    }
}