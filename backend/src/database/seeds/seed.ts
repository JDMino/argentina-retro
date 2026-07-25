import 'dotenv/config';
import { AppDataSource } from '../../config/data-source';
import { Decada } from '../../modules/decadas/entities/decada.entity';
import { Categoria } from '../../modules/categorias/entities/categoria.entity';
import { Contenido } from '../../modules/contenido/entities/contenido.entity';
import { Imagen } from '../../modules/multimedia/entities/imagen.entity';
import { Video } from '../../modules/multimedia/entities/video.entity';
import { Etiqueta } from '../../modules/contenido/entities/etiqueta.entity';
import { ContenidoEtiqueta } from '../../modules/contenido/entities/contenido-etiqueta.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Conectado a la base de datos, sembrando datos...');

  const decadaRepo = AppDataSource.getRepository(Decada);
  const categoriaRepo = AppDataSource.getRepository(Categoria);
  const contenidoRepo = AppDataSource.getRepository(Contenido);
  const etiquetaRepo = AppDataSource.getRepository(Etiqueta);
  const contenidoEtiquetaRepo = AppDataSource.getRepository(ContenidoEtiqueta);

  const decada70 = await decadaRepo.save(
    decadaRepo.create({
      nombre: 'Los 70',
      slug: 'los-70',
      anioInicio: 1970,
      anioFin: 1979,
      descripcion: 'Del rock nacional naciente a los años de plomo.',
      paleta: { primario: '#8B4513', secundario: '#D2691E', acento: '#FFD700' },
      orden: 1,
    }),
  );

  const decada80 = await decadaRepo.save(
    decadaRepo.create({
      nombre: 'Los 80',
      slug: 'los-80',
      anioInicio: 1980,
      anioFin: 1989,
      descripcion: 'Malvinas, el regreso de la democracia y el destape cultural.',
      paleta: { primario: '#FF00FF', secundario: '#00FFFF', acento: '#FFFF00' },
      orden: 2,
    }),
  );

  const decada90 = await decadaRepo.save(
    decadaRepo.create({
      nombre: 'Los 90',
      slug: 'los-90',
      anioInicio: 1990,
      anioFin: 1999,
      descripcion: 'Convertibilidad, cable, Nintendo y el auge de la TV.',
      paleta: { primario: '#00CED1', secundario: '#FF6347', acento: '#7FFF00' },
      orden: 3,
    }),
  );

  const decada2000 = await decadaRepo.save(
    decadaRepo.create({
      nombre: 'Los 2000',
      slug: 'los-2000',
      anioInicio: 2000,
      anioFin: 2009,
      descripcion: 'Internet hogareño, MSN Messenger y la explosión de los cyber cafés.',
      paleta: { primario: '#6BC94B', secundario: '#5BB8E8', acento: '#FFFFFF' },
      orden: 4,
    }),
  );

  const catMusica = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Música', slug: 'musica', icono: 'music', orden: 1 }),
  );
  const catTV = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Programas de TV', slug: 'tv', icono: 'tv', orden: 2 }),
  );
  const catTecnologia = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Tecnología', slug: 'tecnologia', icono: 'cpu', orden: 3 }),
  );

  const etRock = await etiquetaRepo.save(etiquetaRepo.create({ nombre: 'Rock Nacional', slug: 'rock-nacional' }));
  const etConsolas = await etiquetaRepo.save(etiquetaRepo.create({ nombre: 'Consolas', slug: 'consolas' }));

  const contenido1 = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Serú Girán se separa',
      slug: 'seru-giran-se-separa',
      descripcion: 'El fin de una de las bandas más influyentes del rock nacional.',
      anio: 1982,
      decadaId: decada80.id,
      categoriaId: catMusica.id,
      videos: [{ youtubeVideoId: 'dQw4w9WgXcQ', titulo: 'Serú Girán en vivo', orden: 0 } as Video],
      imagenes: [{ url: 'https://example.com/images/seru-giran.jpg', textoAlternativo: 'Serú Girán en vivo', orden: 0 } as Imagen],
    }),
  );

  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: contenido1.id, etiquetaId: etRock.id }),
  );

  const contenido2 = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Llega la Family Game a Argentina',
      slug: 'family-game-argentina',
      descripcion: 'El clon de la NES que popularizó los videojuegos en los hogares argentinos.',
      anio: 1990,
      decadaId: decada90.id,
      categoriaId: catTecnologia.id,
      imagenes: [{ url: 'https://example.com/images/family-game.jpg', textoAlternativo: 'Consola Family Game', orden: 0 } as Imagen],
    }),
  );

  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: contenido2.id, etiquetaId: etConsolas.id }),
  );

  await contenidoRepo.save(
    contenidoRepo.create({
      titulo: "Estreno de Grande Pa'",
      slug: 'estreno-grande-pa',
      descripcion: 'Programa emblemático de la TV de los años 70.',
      anio: 1975,
      decadaId: decada70.id,
      categoriaId: catTV.id,
    }),
  );

  console.log('Seed completado:');
  console.log(`  Décadas: ${decada70.nombre}, ${decada80.nombre}, ${decada90.nombre}, ${decada2000.nombre}`);
  console.log(`  Categorías: ${catMusica.nombre}, ${catTV.nombre}, ${catTecnologia.nombre}`);
  console.log('  Contenido: 3 items de ejemplo con multimedia y etiquetas');

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error al ejecutar el seed:', error);
  process.exit(1);
});