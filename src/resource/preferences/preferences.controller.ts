import { Controller,  UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../guards/auth.guard";
import { PreferencesService } from "./preferences.service";

@Controller({
    version: '1',
    path: 'preferences',
})
@ApiTags('preferences')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) { }
}