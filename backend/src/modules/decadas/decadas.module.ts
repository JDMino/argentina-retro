import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Decada } from './entities/decada.entity';
import { DecadasService } from './decadas.service';
import { DecadasController } from './decadas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Decada])],
  controllers: [DecadasController],
  providers: [DecadasService],
  exports: [DecadasService],
})
export class DecadasModule {}