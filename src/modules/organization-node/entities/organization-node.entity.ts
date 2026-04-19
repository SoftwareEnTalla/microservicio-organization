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
import { CreateOrganizationNodeDto, UpdateOrganizationNodeDto, DeleteOrganizationNodeDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_organization_node_code', ['nodeCode'], { unique: true })
@Index('idx_organization_node_parent', ['parentId'])
@Index('idx_organization_node_org', ['organizationId'])
@Index('idx_organization_node_path', ['path'])
@Unique('uq_organization_node_code', ['nodeCode'])
@ChildEntity('organizationnode')
@ObjectType()
export class OrganizationNode extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de OrganizationNode",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de OrganizationNode", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia OrganizationNode' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de OrganizationNode",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de OrganizationNode", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia OrganizationNode' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Organización raíz a la que pertenece',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Organización raíz a la que pertenece', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Organización raíz a la que pertenece' })
  organizationId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único del nodo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único del nodo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, unique: true, comment: 'Código único del nodo' })
  nodeCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nodo padre (null para raíz)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Nodo padre (null para raíz)', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Nodo padre (null para raíz)' })
  parentId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Path materializado (ej. ORG.VP.DEV.FRONTEND)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Path materializado (ej. ORG.VP.DEV.FRONTEND)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 500, comment: 'Path materializado (ej. ORG.VP.DEV.FRONTEND)' })
  path!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Profundidad en el árbol',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Profundidad en el árbol', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Profundidad en el árbol' })
  depth!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de nodo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de nodo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'UNIT', comment: 'Tipo de nodo' })
  nodeType!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Plantilla planificada (lleva)',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Plantilla planificada (lleva)', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Plantilla planificada (lleva)' })
  targetHeadcount!: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Plantilla real (tiene) calculada por eventos HRMS',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Plantilla real (tiene) calculada por eventos HRMS', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Plantilla real (tiene) calculada por eventos HRMS' })
  actualHeadcount!: number;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor sobrescrito manualmente',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Valor sobrescrito manualmente', nullable: true })
  @Column({ type: 'int', nullable: true, comment: 'Valor sobrescrito manualmente' })
  actualHeadcountManual?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Política de convivencia entre override manual y eventos HRMS',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Política de convivencia entre override manual y eventos HRMS', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'HRMS_WINS', comment: 'Política de convivencia entre override manual y eventos HRMS' })
  overrideMode!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Permite exceder targetHeadcount',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Permite exceder targetHeadcount', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Permite exceder targetHeadcount' })
  allowOverAssignment!: boolean;

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
    type: () => String,
    nullable: true,
    description: 'Centro de costo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Centro de costo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Centro de costo' })
  costCenterCode?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Presupuesto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Presupuesto', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 2, comment: 'Presupuesto' })
  budget?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Moneda',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Moneda', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 8, comment: 'Moneda' })
  currency?: string = '';

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
    // Rule: node-requires-organization
    // Todo nodo requiere organizationId.
    if (!(!(this.organizationId === undefined || this.organizationId === null || (typeof this.organizationId === 'string' && String(this.organizationId).trim() === '') || (Array.isArray(this.organizationId) && this.organizationId.length === 0) || (typeof this.organizationId === 'object' && !Array.isArray(this.organizationId) && Object.prototype.toString.call(this.organizationId) === '[object Object]' && Object.keys(Object(this.organizationId)).length === 0)))) {
      throw new Error('ORG_NODE_001: organizationId requerido');
    }

    // Rule: node-requires-code
    // Todo nodo requiere nodeCode.
    if (!(!(this.nodeCode === undefined || this.nodeCode === null || (typeof this.nodeCode === 'string' && String(this.nodeCode).trim() === '') || (Array.isArray(this.nodeCode) && this.nodeCode.length === 0) || (typeof this.nodeCode === 'object' && !Array.isArray(this.nodeCode) && Object.prototype.toString.call(this.nodeCode) === '[object Object]' && Object.keys(Object(this.nodeCode)).length === 0)))) {
      throw new Error('ORG_NODE_002: nodeCode requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'organizationnode';
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
  static fromDto(dto: CreateOrganizationNodeDto): OrganizationNode;
  static fromDto(dto: UpdateOrganizationNodeDto): OrganizationNode;
  static fromDto(dto: DeleteOrganizationNodeDto): OrganizationNode;
  static fromDto(dto: any): OrganizationNode {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(OrganizationNode, dto);
  }
}
