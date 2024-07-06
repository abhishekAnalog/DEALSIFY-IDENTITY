import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { leadsService } from "./leads.service";
import { NewsletterCreateDto } from "./dto/newslater.request.dto";
import { DealsifyLeadCreateDto } from "./dto/dealsifylead.request.dto";
import { DealsifyOnboardRequest } from "./dto/dealsify-onboard-request.dto";
import { SchoolifyLeadCreateDto } from "./dto/schoolify.leads.request.dto";
import { ApiKey } from "src/common/decorators/api-key.decorator";
import { ApiKeyGuard } from "src/guards/ApiKey.guard";

@Controller({
    version: '1',
    path: 'leads',
})

export class leadsController {
    constructor(
        private leadsService: leadsService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post("newsletter")
    create(@Body() newsletterCreateDto: NewsletterCreateDto) {
        return this.leadsService.create(newsletterCreateDto);
    }

    @ApiKey()
    @UseGuards(ApiKeyGuard)
    @HttpCode(HttpStatus.OK)
    @Post("dealsify")
    leadCreate(@Req() req, @Body() dealsifyLeadCreateDto: DealsifyLeadCreateDto) {
        const companyId = req?.company?._id;
        return this.leadsService.leadCreate(dealsifyLeadCreateDto, companyId);
    }

    @ApiKey()
    @UseGuards(ApiKeyGuard)
    @HttpCode(HttpStatus.OK)
    @Post("dealsify-onboard")
    onboardLeadCreate(@Req() req, @Body() dealsifyOnboardRequest: DealsifyOnboardRequest) {
        const companyId = req?.company?._id;
        return this.leadsService.onboardLeadCreate(dealsifyOnboardRequest, companyId);
    }

    @ApiKey()
    @UseGuards(ApiKeyGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    schoolifyLeadCreate(@Req() req, @Body() schoolifyLeadCreate: SchoolifyLeadCreateDto) {
        const companyId = req?.company?._id;
        return this.leadsService.schoolifyLeadCreate(schoolifyLeadCreate, companyId);
    }
}