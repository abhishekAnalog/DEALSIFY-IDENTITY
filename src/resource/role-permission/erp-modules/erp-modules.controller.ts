import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { erpModulesService } from "./erp-modules.service";
import { CreateModulesDto } from "./dto/create-modules.dto";
import { AuthGuard } from "src/guards/auth.guard";


@Controller({
    version: '1',
    path: 'modules',
})
 
export class erpModulesController {
    constructor(private erpModulesService: erpModulesService) { }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get()
    get() {
        return this.erpModulesService.findAll();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    getById(@Param('id') id: string,) {
        return this.erpModulesService.findById(id);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() createModulesDto: CreateModulesDto) {
        return this.erpModulesService.create(createModulesDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Put(":id")
    update(@Param('id') id: string, @Body() createModulesDto: CreateModulesDto) {
        return this.erpModulesService.update(id, createModulesDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete(":id")
    delete(@Param('id') id: string) {
        return this.erpModulesService.delete(id);
    }
}