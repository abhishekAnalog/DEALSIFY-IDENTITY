import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateTransactionCustomizationDto {
    @IsOptional()
    @ApiProperty()
    readonly transactionType: string;

    @IsOptional()
    @ApiProperty()
    readonly series: string;

    @IsOptional()
    @ApiProperty()
    readonly delimiter: string;

    @IsOptional()
    @Transform(({ value }) => +value)
    @IsNumber()
    @ApiProperty()
    readonly sequenceLength: number;

    @IsOptional()
    @Transform(({ value }) => +value)
    @IsNumber()
    @ApiProperty()
    readonly sequence: number;
}
