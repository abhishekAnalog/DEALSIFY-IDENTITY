import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../guards/auth.guard";
import { ApiKeyGenerateService } from "./api-key-generate.service";

@Controller({
    version: '1',
    path: 'apikey-generate',
})
@ApiTags('ApiKeyGenerate')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ApiKeyGenerateController {
    constructor(private readonly apikeyGenerate: ApiKeyGenerateService) { }

    @HttpCode(HttpStatus.OK)
    @Post()
    generateApiKey(@Req() req) {
        const companyId = req?.user?.companyId;
        return this.apikeyGenerate.apiKeyGenerate(
            companyId
        );
    }

}