import { Expose } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { LogsAction } from 'src/logs/models/enums/logs.action.enum';
import { baseEntity } from 'src/shared/entities/base.entity';

@Entity('logs')
@Index(['entityName', 'entityId']) // supports fast lookup of "all logs for entity X"
@Index(['actorId'])
@Index(['createdAt'])
@Index(['correlationId']) // speeds up tracing all logs tied to a single request/transaction
export class Logs extends baseEntity {
  @Expose()
  @Column({ name: 'entity_name', type: 'varchar', length: 100 })
  entityName: string; // e.g. 'users', 'permissions', 'accounts'

  @Expose()
  @Column({ name: 'entity_id', type: 'uuid' })
  entityId: string; // ID of the audited record

  @Expose()
  @Column({ type: 'enum', enum: LogsAction })
  action: LogsAction;

  @Expose()
  @Column({
    name: 'correlation_id',
    type: 'uuid',
    nullable: true, // nullable: older logs predate correlation ID tracking
  })
  correlationId: string | null;

  @Expose()
  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId: string | null; // who performed the action

  // actorRole/actorName are a snapshot of the actor at the time of the action,
  // not a duplication of the users table: they must stay correct even if the
  // user is later renamed, has their role changed, or is deleted.
  @Expose()
  @Column({ name: 'actor_role', type: 'varchar', length: 100, nullable: true })
  actorRole: string | null;

  @Expose()
  @Column({ name: 'actor_name', type: 'varchar', length: 255, nullable: true })
  actorName: string | null;

  // Full state snapshot (before and after)
  @Expose()
  @Column({ name: 'previous_state', type: 'jsonb', nullable: true })
  previousState: Record<string, any> | null;

  // Computed diff (only the fields that changed)
  @Expose()
  @Column({ name: 'changed_fields', type: 'jsonb', nullable: true })
  changedFields: Record<string, { from: any; to: any }> | null;

  @Expose()
  @Column({ name: 'new_state', type: 'jsonb', nullable: true })
  newState: Record<string, any> | null;

  // Request metadata (sourced from AuditContext)
  @Expose()
  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  ipAddress: string | null;

  @Expose()
  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @Expose()
  @Column({ name: 'http_method', type: 'varchar', length: 10, nullable: true })
  httpMethod: string | null;

  @Expose()
  @Column({ name: 'http_path', type: 'varchar', length: 500, nullable: true })
  httpPath: string | null;

  @Expose()
  @Column({
    name: 'observation',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  observation: string | null; // optional custom description
}
