import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { DecadasModule } from './modules/decadas/decadas.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ContenidoModule } from './modules/contenido/contenido.module';
import { EtiquetasModule } from './modules/etiquetas/etiquetas.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { FavoritosModule } from './modules/favoritos/favoritos.module';
import { ComentariosModule } from './modules/comentarios/comentarios.module';
import { ConfiguracionModule } from './modules/configuracion/configuracion.module';
import databaseConfig from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<TypeOrmModuleOptions>('database'),
    }),
    HealthModule,
    DecadasModule,
    CategoriasModule,
    ContenidoModule,
    EtiquetasModule,
    PlaylistsModule,
    RolesModule,
    UsuariosModule,
    AuthModule,
    FavoritosModule,
    ComentariosModule,
    ConfiguracionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}