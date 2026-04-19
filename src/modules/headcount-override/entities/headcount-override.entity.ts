/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateHeadcountOverrideDto, UpdateHeadcountOverrideDto, DeleteHeadcountOverrideDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_headcount_override_node', ['nodeId'])
@Index('idx_headcount_override_applied_at', ['appliedAt'])
@ChildEntity('headcountoverride')
@ObjectType()
export class HeadcountOverride extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de HeadcountOverride",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de HeadcountOverride", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia HeadcountOverride' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de HeadcountOverride",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de HeadcountOverride", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia HeadcountOverride' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nodo afectado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nodo afectado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Nodo afectado' })
  nodeId!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Valor anterior de actualHeadcount',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Valor anterior de actualHeadcount', nullable: false })
  @Column({ type: 'int', nullable: false, comment: 'Valor anterior de actualHeadcount' })
  previousValue!: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Nuevo valor',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Nuevo valor', nullable: false })
  @Column({ type: 'int', nullable: false, comment: 'Nuevo valor' })
  newValue!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Política de convivencia',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Política de convivencia', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'MANUAL_WINS', comment: 'Política de convivencia' })
  mode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Motivo del override',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Motivo del override', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 500, comment: 'Motivo del override' })
  reason!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Usuario que aplicó',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Usuario que aplicó', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Usuario que aplicó' })
  appliedBy!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de aplicación',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de aplicación', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Fecha de aplicación' })
  appliedAt!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha opcional de expiración',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha opcional de expiración', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha opcional de expiración' })
  expiresAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado' })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: override-requires-node
    // El override requiere nodeId.
    if (!(!(this.nodeId === undefined || this.nodeId === null || (typeof this.nodeId === 'string' && String(this.nodeId).trim() === '') || (Array.isArray(this.nodeId) && this.nodeId.length === 0) || (typeof this.nodeId === 'object' && !Array.isArray(this.nodeId) && Object.prototype.toString.call(this.nodeId) === '[object Object]' && Object.keys(Object(this.nodeId)).length === 0)))) {
      throw new Error('ORG_OVR_001: nodeId requerido');
    }

    // Rule: override-requires-reason
    // El override requiere motivo.
    if (!(!(this.reason === undefined || this.reason === null || (typeof this.reason === 'string' && String(this.reason).trim() === '') || (Array.isArray(this.reason) && this.reason.length === 0) || (typeof this.reason === 'object' && !Array.isArray(this.reason) && Object.prototype.toString.call(this.reason) === '[object Object]' && Object.keys(Object(this.reason)).length === 0)))) {
      throw new Error('ORG_OVR_002: reason requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'headcountoverride';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateHeadcountOverrideDto): HeadcountOverride;
  static fromDto(dto: UpdateHeadcountOverrideDto): HeadcountOverride;
  static fromDto(dto: DeleteHeadcountOverrideDto): HeadcountOverride;
  static fromDto(dto: any): HeadcountOverride {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(HeadcountOverride, dto);
  }
}
