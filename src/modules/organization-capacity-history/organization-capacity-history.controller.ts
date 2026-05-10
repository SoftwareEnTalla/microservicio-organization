import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OrganizationCapacityHistoryService } from './organization-capacity-history.service';

@ApiTags('organization-capacity-history')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('capacity-history')
export class OrganizationCapacityHistoryController {
  constructor(private readonly service: OrganizationCapacityHistoryService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen actual y snapshots recientes de capacidad organizacional' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen de capacidad organizacional.' })
  async getSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getSummary(Number(limit || 12));
  }

  @Get('history')
  @ApiOperation({ summary: 'Histórico reciente de snapshots de capacidad organizacional' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Histórico de capacidad organizacional.' })
  async getHistory(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    const history = await this.service.getHistory(Number(limit || 20));
    return {
      ok: true,
      message: 'Histórico de capacidad organizacional obtenido con éxito.',
      data: history,
      count: history.length,
    };
  }

  @Post('snapshot')
  @ApiOperation({ summary: 'Generar snapshot manual de capacidad organizacional' })
  @ApiQuery({ name: 'source', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Snapshot de capacidad generado.' })
  async captureSnapshot(@Query('source') source?: string): Promise<Record<string, unknown>> {
    return this.service.captureSnapshot(source || 'MANUAL');
  }
}