import 'dotenv/config';
import { AppDataSource } from '../../config/data-source';
import { Decada } from '../../modules/decadas/entities/decada.entity';
import { Categoria } from '../../modules/categorias/entities/categoria.entity';
import { Contenido } from '../../modules/contenido/entities/contenido.entity';
import { Imagen } from '../../modules/multimedia/entities/imagen.entity';
import { Video } from '../../modules/multimedia/entities/video.entity';
import { Etiqueta } from '../../modules/contenido/entities/etiqueta.entity';
import { ContenidoEtiqueta } from '../../modules/contenido/entities/contenido-etiqueta.entity';
import { Playlist } from '../../modules/playlists/entities/playlist.entity';
import { Rol } from '../../modules/roles/entities/rol.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Conectado a la base de datos, limpiando tablas...');

  await AppDataSource.query(
    'TRUNCATE TABLE contenido_etiquetas, imagenes, videos, contenidos, etiquetas, categorias, decadas, playlists, usuario_roles, usuarios, roles RESTART IDENTITY CASCADE;',
  );

  console.log('Sembrando datos...');

  const decadaRepo = AppDataSource.getRepository(Decada);
  const categoriaRepo = AppDataSource.getRepository(Categoria);
  const contenidoRepo = AppDataSource.getRepository(Contenido);
  const etiquetaRepo = AppDataSource.getRepository(Etiqueta);
  const contenidoEtiquetaRepo = AppDataSource.getRepository(ContenidoEtiqueta);
  const playlistRepo = AppDataSource.getRepository(Playlist);
  const rolRepo = AppDataSource.getRepository(Rol);


  // ---------- Roles ----------
  const rolAdmin = await rolRepo.save(
    rolRepo.create({ nombre: 'admin', descripcion: 'Acceso total al panel administrativo y gestión de contenido.' }),
  );
  const rolUsuario = await rolRepo.save(
    rolRepo.create({ nombre: 'usuario', descripcion: 'Usuario registrado con acceso a favoritos, comentarios y perfil.' }),
  );
  // ---------- Décadas ----------

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

  // ---------- Playlists ----------

  await playlistRepo.save(
    playlistRepo.create({
      nombre: 'Rock nacional de los 70',
      youtubePlaylistId: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
      descripcion: 'Los clásicos del rock argentino que marcaron la década.',
      decadaId: decada70.id,
    }),
  );

  await playlistRepo.save(
    playlistRepo.create({
      nombre: 'Grandes éxitos de los 80',
      youtubePlaylistId: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
      descripcion: 'Synth, pop y rock ochentoso.',
      decadaId: decada80.id,
    }),
  );

  await playlistRepo.save(
    playlistRepo.create({
      nombre: 'Lo mejor de los 90',
      youtubePlaylistId: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
      descripcion: 'Soda Stereo, Los Piojos y compañía.',
      decadaId: decada90.id,
    }),
  );

  await playlistRepo.save(
    playlistRepo.create({
      nombre: 'Himnos de los 2000',
      youtubePlaylistId: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
      descripcion: 'La música que sonaba en el cyber y en la radio.',
      decadaId: decada2000.id,
    }),
  );

  // ---------- Categorías ----------

  const catMusica = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Música', slug: 'musica', icono: 'music', orden: 1 }),
  );
  const catTV = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Programas de TV', slug: 'tv', icono: 'tv', orden: 2 }),
  );
  const catTecnologia = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Tecnología', slug: 'tecnologia', icono: 'cpu', orden: 3 }),
  );
  const catDeportes = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Deportes', slug: 'deportes', icono: 'trophy', orden: 4 }),
  );
  const catPublicidades = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Publicidades', slug: 'publicidades', icono: 'megaphone', orden: 5 }),
  );
  const catGolosinas = await categoriaRepo.save(
    categoriaRepo.create({ nombre: 'Golosinas', slug: 'golosinas', icono: 'candy', orden: 6 }),
  );

  // ---------- Etiquetas ----------

  const etRock = await etiquetaRepo.save(etiquetaRepo.create({ nombre: 'Rock Nacional', slug: 'rock-nacional' }));
  const etConsolas = await etiquetaRepo.save(etiquetaRepo.create({ nombre: 'Consolas', slug: 'consolas' }));
  const etMundial = await etiquetaRepo.save(etiquetaRepo.create({ nombre: 'Mundiales', slug: 'mundiales' }));
  const etPublicidadClasica = await etiquetaRepo.save(
    etiquetaRepo.create({ nombre: 'Publicidad Clásica', slug: 'publicidad-clasica' }),
  );
  const etInternet = await etiquetaRepo.save(etiquetaRepo.create({ nombre: 'Internet', slug: 'internet' }));
  const etMarcasArgentinas = await etiquetaRepo.save(
    etiquetaRepo.create({ nombre: 'Marcas Argentinas', slug: 'marcas-argentinas' }),
  );

  // ---------- Contenido: Los 70 ----------

  const grandePa = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: "Estreno de Grande Pa'",
      slug: 'estreno-grande-pa',
      descripcion: 'Programa emblemático de la TV de los años 70.',
      anio: 1975,
      decadaId: decada70.id,
      categoriaId: catTV.id,
      imagenes: [
        { url: 'https://picsum.photos/seed/grande-pa/600/400', textoAlternativo: "Grande Pa'", orden: 0 } as Imagen,
      ],
    }),
  );

  const mundial78 = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Mundial 78: Argentina Campeón',
      slug: 'mundial-78-argentina-campeon',
      descripcion: 'Argentina se consagra campeón del mundo por primera vez, jugando de local.',
      anio: 1978,
      decadaId: decada70.id,
      categoriaId: catDeportes.id,
      enlacesExternos: [
        { etiqueta: 'Wikipedia', url: 'https://es.wikipedia.org/wiki/Copa_Mundial_de_F%C3%BAtbol_de_1978' },
      ],
      imagenes: [
        { url: 'https://picsum.photos/seed/mundial-78/600/400', textoAlternativo: 'Mundial 78', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: mundial78.id, etiquetaId: etMundial.id }),
  );

  // ---------- Contenido: Los 80 ----------

  const seruGiran = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Serú Girán se separa',
      slug: 'seru-giran-se-separa',
      descripcion: 'El fin de una de las bandas más influyentes del rock nacional.',
      anio: 1982,
      decadaId: decada80.id,
      categoriaId: catMusica.id,
      enlacesExternos: [
        { etiqueta: 'Wikipedia', url: 'https://es.wikipedia.org/wiki/Ser%C3%BA_Gir%C3%A1n' },
      ],
      videos: [{ youtubeVideoId: 'dQw4w9WgXcQ', titulo: 'Serú Girán en vivo', orden: 0 } as Video],
      imagenes: [
        { url: 'https://picsum.photos/seed/seru-giran/600/400', textoAlternativo: 'Serú Girán en vivo', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: seruGiran.id, etiquetaId: etRock.id }),
  );

  const publicidadTerrabusi = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Publicidad de galletitas Terrabusi',
      slug: 'publicidad-galletitas-terrabusi',
      descripcion: 'Un clásico de la tanda televisiva de los años 80.',
      anio: 1985,
      decadaId: decada80.id,
      categoriaId: catPublicidades.id,
      videos: [{ youtubeVideoId: 'dQw4w9WgXcQ', titulo: 'Comercial Terrabusi', orden: 0 } as Video],
      imagenes: [
        { url: 'https://picsum.photos/seed/terrabusi/600/400', textoAlternativo: 'Publicidad Terrabusi', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: publicidadTerrabusi.id, etiquetaId: etPublicidadClasica.id }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: publicidadTerrabusi.id, etiquetaId: etMarcasArgentinas.id }),
  );

  // ---------- Contenido: Los 90 ----------

  const familyGame = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Llega la Family Game a Argentina',
      slug: 'family-game-argentina',
      descripcion: 'El clon de la NES que popularizó los videojuegos en los hogares argentinos.',
      anio: 1990,
      decadaId: decada90.id,
      categoriaId: catTecnologia.id,
      imagenes: [
        { url: 'https://picsum.photos/seed/family-game/600/400', textoAlternativo: 'Consola Family Game', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: familyGame.id, etiquetaId: etConsolas.id }),
  );

  const sodaStereo = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Soda Stereo lanza Dynamo',
      slug: 'soda-stereo-lanza-dynamo',
      descripcion: 'El álbum más experimental de la banda, adelantado a su época.',
      anio: 1992,
      decadaId: decada90.id,
      categoriaId: catMusica.id,
      enlacesExternos: [
        { etiqueta: 'Wikipedia', url: 'https://es.wikipedia.org/wiki/Dynamo_(%C3%A1lbum)' },
      ],
      imagenes: [
        { url: 'https://picsum.photos/seed/soda-dynamo/600/400', textoAlternativo: 'Soda Stereo Dynamo', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: sodaStereo.id, etiquetaId: etRock.id }),
  );

  const bonOBon = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Bon o Bon cumple 10 años',
      slug: 'bon-o-bon-diez-anios',
      descripcion: 'La golosina de chocolate y maní se convierte en un clásico argentino.',
      anio: 1994,
      decadaId: decada90.id,
      categoriaId: catGolosinas.id,
      imagenes: [
        { url: 'https://picsum.photos/seed/bon-o-bon/600/400', textoAlternativo: 'Bon o Bon', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: bonOBon.id, etiquetaId: etMarcasArgentinas.id }),
  );

  // ---------- Contenido: Los 2000 ----------

  const msnMessenger = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'MSN Messenger llega a los hogares argentinos',
      slug: 'msn-messenger-argentina',
      descripcion: 'El chat que definió a toda una generación en los cyber cafés y el hogar.',
      anio: 2003,
      decadaId: decada2000.id,
      categoriaId: catTecnologia.id,
      enlacesExternos: [
        { etiqueta: 'Wikipedia', url: 'https://es.wikipedia.org/wiki/Windows_Live_Messenger' },
      ],
      imagenes: [
        { url: 'https://picsum.photos/seed/msn-messenger/600/400', textoAlternativo: 'MSN Messenger', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: msnMessenger.id, etiquetaId: etInternet.id }),
  );

  const mundial2002 = await contenidoRepo.save(
    contenidoRepo.create({
      titulo: 'Argentina en el Mundial 2002',
      slug: 'argentina-mundial-2002',
      descripcion: 'Una eliminación en primera ronda que marcó a toda una generación de hinchas.',
      anio: 2002,
      decadaId: decada2000.id,
      categoriaId: catDeportes.id,
      imagenes: [
        { url: 'https://picsum.photos/seed/mundial-2002/600/400', textoAlternativo: 'Mundial 2002', orden: 0 } as Imagen,
      ],
    }),
  );
  await contenidoEtiquetaRepo.save(
    contenidoEtiquetaRepo.create({ contenidoId: mundial2002.id, etiquetaId: etMundial.id }),
  );

  console.log('Seed completado:');
  console.log(`  Décadas: ${decada70.nombre}, ${decada80.nombre}, ${decada90.nombre}, ${decada2000.nombre}`);
  console.log(
    `  Categorías: ${catMusica.nombre}, ${catTV.nombre}, ${catTecnologia.nombre}, ${catDeportes.nombre}, ${catPublicidades.nombre}, ${catGolosinas.nombre}`,
  );
  console.log('  Contenido: 9 items de ejemplo, distribuidos en las 4 décadas con al menos 2 categorías cada una');
  console.log('  Playlists: 1 por década (4 en total)');
  console.log(`  Roles: ${rolAdmin.nombre}, ${rolUsuario.nombre}`);
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error al ejecutar el seed:', error);
  process.exit(1);
});