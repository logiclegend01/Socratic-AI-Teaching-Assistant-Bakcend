import { Body, Controller, Get, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"

@Controller("api/auth")
export class AuthController {
    constructor(private Auth: AuthService) { }

    @Get("health")
    getHelth() {
        return {
            message: "server is up and running",
            status: 200,
            name: "Socratic-AI-Teaching-Assistant-Bakcend",
            developers: {
                frontend: "ashish kapoor",
                baceknd: "sujan thapa"
            }
        }
    }

    @Post("register")
    async register(@Body() body: { name, username, email, password }) {
        const { username, email, name, password } = body
        return this.Auth.registerUser(username, name, email, password)

    }




}