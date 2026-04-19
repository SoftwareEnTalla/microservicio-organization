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
import { CreateOrganizationNodeAttributeDto, UpdateOrganizationNodeAttributeDto, DeleteOrganizationNodeAttributeDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_node_attr_node_key', ['nodeId', 'attributeKey'], { unique: true })
@Unique('uq_node_attr_key', ['nodeId', 'attributeKey'])
@ChildEntity('organizationnodeattribute')
@ObjectType()
export class OrganizationNodeAttribute extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de OrganizationNodeAttribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de OrganizationNodeAttribute", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia OrganizationNodeAttribute' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de OrganizationNodeAttribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de OrganizationNodeAttribute", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia OrganizationNodeAttribute' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nodo dueño del atributo',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nodo dueño del atributo', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Nodo dueño del atributo' })
  nodeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave del atributo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Clave del atributo' })
  attributeKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor del atributo (serializado)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor del atributo (serializado)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 2000, comment: 'Valor del atributo (serializado)' })
  attributeValue?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo semántico',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo semántico', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'STRING', comment: 'Tipo semántico' })
  valueType!: string;

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
    // Rule: attr-requires-node
    // El atributo requiere nodeId.
    if (!(!(this.nodeId === undefined || this.nodeId === null || (typeof this.nodeId === 'string' && String(this.nodeId).trim() === '') || (Array.isArray(this.nodeId) && this.nodeId.length === 0) || (typeof this.nodeId === 'object' && !Array.isArray(this.nodeId) && Object.prototype.toString.call(this.nodeId) === '[object Object]' && Object.keys(Object(this.nodeId)).length === 0)))) {
      throw new Error('ORG_ATTR_001: nodeId requerido');
    }

    // Rule: attr-requires-key
    // El atributo requiere attributeKey.
    if (!(!(this.attributeKey === undefined || this.attributeKey === null || (typeof this.attributeKey === 'string' && String(this.attributeKey).trim() === '') || (Array.isArray(this.attributeKey) && this.attributeKey.length === 0) || (typeof this.attributeKey === 'object' && !Array.isArray(this.attributeKey) && Object.prototype.toString.call(this.attributeKey) === '[object Object]' && Object.keys(Object(this.attributeKey)).length === 0)))) {
      throw new Error('ORG_ATTR_002: attributeKey requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'organizationnodeattribute';
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
  static fromDto(dto: CreateOrganizationNodeAttributeDto): OrganizationNodeAttribute;
  static fromDto(dto: UpdateOrganizationNodeAttributeDto): OrganizationNodeAttribute;
  static fromDto(dto: DeleteOrganizationNodeAttributeDto): OrganizationNodeAttribute;
  static fromDto(dto: any): OrganizationNodeAttribute {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(OrganizationNodeAttribute, dto);
  }
}
