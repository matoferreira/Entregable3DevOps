import { IsUUID, IsString, IsInt, IsPositive } from 'class-validator';

export class CreateTravelDto {
  @IsUUID() employeeId: string;
  @IsString() destination: string;
  @IsInt() @IsPositive() days: number;
}
