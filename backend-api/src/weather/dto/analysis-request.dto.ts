import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum AnalysisContext {
  GENERAL = 'general',
  HEALTH = 'health',   
  ACTIVITY = 'activity',  
  OUTFIT = 'outfit',    
}

export class AnalysisRequestDto {
  @IsEnum(AnalysisContext)
  @IsNotEmpty()
  context: AnalysisContext;

  @IsString()
  @IsOptional()
  city?: string; 
}