import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type CapacitySnapshot = {
  snapshotAt: string;
  source: string;
  metricHash: string;
  nodesCount: number;
  rootNodeCount: number;
  leafNodeCount: number;
  maxDepth: number;
  targetHeadcount: number;
  actualHeadcount: number;
  nodesWithGapCount: number;
  overAssignmentEnabledCount: number;
  plannedSeatRowsCount: number;
  plannedSeatsCount: number;
  filledSeatsCount: number;
  criticalSeatsCount: number;
  seatGap: number;
  seatCoveragePercent: number;
  overrideCount: number;
};

@Injectable()
export class OrganizationCapacityHistoryService {
  constructor(
    @Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined,
    private readonly configService: ConfigService,
  ) {}

  async getSummary(limit: number = 12): Promise<Record<string, unknown>> {
    const current = await this.computeCurrentSnapshot('AUTO_SUMMARY');
    const persisted = await this.persistIfNeeded(current);
    const history = await this.getHistory(limit);
    return {
      ok: true,
      message: 'Resumen de capacidad organizacional obtenido con éxito.',
      data: {
        current,
        persisted,
        latestSnapshot: history[0] ?? null,
        history,
      },
    };
  }

  async captureSnapshot(source: string = 'MANUAL'): Promise<Record<string, unknown>> {
    const snapshot = await this.computeCurrentSnapshot(source);
    const persisted = await this.persistIfNeeded(snapshot, true);
    return {
      ok: true,
      message: 'Snapshot de capacidad organizacional generado con éxito.',
      data: persisted ?? snapshot,
    };
  }

  async getHistory(limit: number = 20): Promise<Array<Record<string, unknown>>> {
    const dataSource = await this.resolveDataSource();
    if (!dataSource) {
      return [];
    }

    const safeLimit = Math.max(1, Math.min(limit, 100));
    return dataSource.query(
      `SELECT * FROM ${this.tableName()} ORDER BY "snapshotAt" DESC, "creationDate" DESC LIMIT $1`,
      [safeLimit],
    );
  }

  private async computeCurrentSnapshot(source: string): Promise<CapacitySnapshot> {
    const dataSource = await this.resolveDataSource();
    if (!dataSource) {
      const now = new Date().toISOString();
      return {
        snapshotAt: now,
        source,
        metricHash: this.hashMetrics({ snapshotAt: now, source }),
        nodesCount: 0,
        rootNodeCount: 0,
        leafNodeCount: 0,
        maxDepth: 0,
        targetHeadcount: 0,
        actualHeadcount: 0,
        nodesWithGapCount: 0,
        overAssignmentEnabledCount: 0,
        plannedSeatRowsCount: 0,
        plannedSeatsCount: 0,
        filledSeatsCount: 0,
        criticalSeatsCount: 0,
        seatGap: 0,
        seatCoveragePercent: 0,
        overrideCount: 0,
      };
    }

    const [nodeSummary] = await dataSource.query(
      `SELECT
         COUNT(*)::int AS "nodesCount",
         COUNT(*) FILTER (WHERE "parentId" IS NULL)::int AS "rootNodeCount",
         COALESCE(SUM(COALESCE("targetHeadcount", 0)), 0)::int AS "targetHeadcount",
         COALESCE(SUM(COALESCE("actualHeadcount", 0)), 0)::int AS "actualHeadcount",
         COUNT(*) FILTER (WHERE COALESCE("targetHeadcount", 0) > COALESCE("actualHeadcount", 0))::int AS "nodesWithGapCount",
         COUNT(*) FILTER (WHERE COALESCE("allowOverAssignment", false) = true)::int AS "overAssignmentEnabledCount",
         COALESCE(MAX(array_length(regexp_split_to_array(NULLIF(regexp_replace(COALESCE("path", ''), '[/.]+', '.', 'g'), ''), '\\.'), 1)), 0)::int AS "maxDepth"
       FROM organization_node_base_entity
       WHERE type = 'organizationnode' AND "isActive" = true`,
    );

    const [leafSummary] = await dataSource.query(
      `SELECT COUNT(*)::int AS "leafNodeCount"
       FROM organization_node_base_entity parent
       WHERE parent.type = 'organizationnode'
         AND parent."isActive" = true
         AND NOT EXISTS (
           SELECT 1
           FROM organization_node_base_entity child
           WHERE child.type = 'organizationnode'
             AND child."isActive" = true
             AND child."parentId" = parent.id
         )`,
    );

    const [seatSummary] = await dataSource.query(
      `SELECT
         COUNT(*)::int AS "plannedSeatRowsCount",
         COALESCE(SUM(COALESCE("count", 0)), 0)::int AS "plannedSeatsCount",
         COALESCE(SUM(COALESCE("filledCount", 0)), 0)::int AS "filledSeatsCount",
         COUNT(*) FILTER (WHERE COALESCE("isCritical", false) = true)::int AS "criticalSeatsCount"
       FROM planned_seat_base_entity
       WHERE type = 'plannedseat' AND "isActive" = true`,
    );

    const [overrideSummary] = await dataSource.query(
      `SELECT COUNT(*)::int AS "overrideCount"
       FROM headcount_override_base_entity
       WHERE type = 'headcountoverride' AND "isActive" = true`,
    );

    const plannedSeatsCount = Number(seatSummary?.plannedSeatsCount ?? 0);
    const filledSeatsCount = Number(seatSummary?.filledSeatsCount ?? 0);
    const seatGap = Math.max(plannedSeatsCount - filledSeatsCount, 0);

    const snapshotBase = {
      snapshotAt: new Date().toISOString(),
      source,
      nodesCount: Number(nodeSummary?.nodesCount ?? 0),
      rootNodeCount: Number(nodeSummary?.rootNodeCount ?? 0),
      leafNodeCount: Number(leafSummary?.leafNodeCount ?? 0),
      maxDepth: Number(nodeSummary?.maxDepth ?? 0),
      targetHeadcount: Number(nodeSummary?.targetHeadcount ?? 0),
      actualHeadcount: Number(nodeSummary?.actualHeadcount ?? 0),
      nodesWithGapCount: Number(nodeSummary?.nodesWithGapCount ?? 0),
      overAssignmentEnabledCount: Number(nodeSummary?.overAssignmentEnabledCount ?? 0),
      plannedSeatRowsCount: Number(seatSummary?.plannedSeatRowsCount ?? 0),
      plannedSeatsCount,
      filledSeatsCount,
      criticalSeatsCount: Number(seatSummary?.criticalSeatsCount ?? 0),
      seatGap,
      seatCoveragePercent: plannedSeatsCount > 0 ? Math.round((filledSeatsCount / plannedSeatsCount) * 100) : 0,
      overrideCount: Number(overrideSummary?.overrideCount ?? 0),
    };

    return {
      ...snapshotBase,
      metricHash: this.hashMetrics(snapshotBase),
    };
  }

  private async persistIfNeeded(
    snapshot: CapacitySnapshot,
    force: boolean = false,
  ): Promise<Record<string, unknown> | null> {
    const dataSource = await this.resolveDataSource();
    if (!dataSource) {
      return null;
    }

    const latest = await this.getLatestSnapshot();
    const latestHash = String(latest?.metricHash ?? '');
    const latestSnapshotAt = latest?.snapshotAt ? new Date(String(latest.snapshotAt)).getTime() : 0;
    const currentSnapshotAt = new Date(snapshot.snapshotAt).getTime();
    const withinCooldown = currentSnapshotAt - latestSnapshotAt < 15 * 60 * 1000;

    if (!force && latestHash === snapshot.metricHash && withinCooldown) {
      return latest as Record<string, unknown>;
    }

    const metadata = {
      generatedAt: snapshot.snapshotAt,
      targetVsActualGap: snapshot.targetHeadcount - snapshot.actualHeadcount,
      seatGap: snapshot.seatGap,
    };

    await dataSource.query(
      `INSERT INTO ${this.tableName()}
        ("creationDate", "modificationDate", "createdBy", "isActive", name, description,
         "snapshotAt", source, "metricHash", "nodesCount", "rootNodeCount", "leafNodeCount", "maxDepth",
         "targetHeadcount", "actualHeadcount", "nodesWithGapCount", "overAssignmentEnabledCount",
         "plannedSeatRowsCount", "plannedSeatsCount", "filledSeatsCount", "criticalSeatsCount",
         "seatGap", "seatCoveragePercent", "overrideCount", metadata)
       VALUES
        ($1, $1, $2, $3, $4, $5,
         $6, $7, $8, $9, $10, $11, $12,
         $13, $14, $15, $16,
         $17, $18, $19, $20,
         $21, $22, $23, $24)
       `,
      [
        snapshot.snapshotAt,
        'organization-capacity-history',
        true,
        `capacity-${new Date(snapshot.snapshotAt).getTime()}`,
        `capacity snapshot ${snapshot.source.toLowerCase()}`,
        snapshot.snapshotAt,
        snapshot.source,
        snapshot.metricHash,
        snapshot.nodesCount,
        snapshot.rootNodeCount,
        snapshot.leafNodeCount,
        snapshot.maxDepth,
        snapshot.targetHeadcount,
        snapshot.actualHeadcount,
        snapshot.nodesWithGapCount,
        snapshot.overAssignmentEnabledCount,
        snapshot.plannedSeatRowsCount,
        snapshot.plannedSeatsCount,
        snapshot.filledSeatsCount,
        snapshot.criticalSeatsCount,
        snapshot.seatGap,
        snapshot.seatCoveragePercent,
        snapshot.overrideCount,
        JSON.stringify(metadata),
      ],
    );

    return this.getLatestSnapshot();
  }

  private async getLatestSnapshot(): Promise<Record<string, unknown> | null> {
    const dataSource = await this.resolveDataSource();
    if (!dataSource) {
      return null;
    }

    const rows = await dataSource.query(
      `SELECT * FROM ${this.tableName()} ORDER BY "snapshotAt" DESC, "creationDate" DESC LIMIT 1`,
    );
    return rows?.[0] ?? null;
  }

  private async resolveDataSource(): Promise<DataSource | null> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }

  private tableName(): string {
    return this.configService.get<string>('ORGANIZATION_CAPACITY_HISTORY_TABLE') ?? 'organization_capacity_history_base_entity';
  }

  private hashMetrics(metrics: Record<string, unknown>): string {
    return createHash('sha256').update(JSON.stringify(metrics)).digest('hex');
  }
}