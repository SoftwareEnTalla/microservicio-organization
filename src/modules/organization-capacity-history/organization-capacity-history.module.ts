import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationCapacityHistoryController } from './organization-capacity-history.controller';
import { OrganizationCapacityHistoryService } from './organization-capacity-history.service';

@Module({
  imports: [ConfigModule],
  controllers: [OrganizationCapacityHistoryController],
  providers: [OrganizationCapacityHistoryService],
  exports: [OrganizationCapacityHistoryService],
})
export class OrganizationCapacityHistoryModule {}