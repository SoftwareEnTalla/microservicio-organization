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


import { Module } from "@nestjs/common";
import { OrganizationTypeLoggingInterceptor } from "../interceptors/organizationtype.logging.interceptor";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { OrganizationTypeAuthGuard } from "../guards/organizationtypeauthguard.guard";

@Module({
  providers: [
    OrganizationTypeAuthGuard,
    OrganizationTypeLoggingInterceptor,
    CommandBus,
    EventBus,
    UnhandledExceptionBus,
  ],
  exports: [OrganizationTypeAuthGuard, CommandBus, EventBus, UnhandledExceptionBus],
})
export class AuthOrganizationTypeModule {}
