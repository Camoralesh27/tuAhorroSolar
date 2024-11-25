import path from 'path'
import fs from 'fs'
import { glob } from 'glob'

import { src, dest, watch, series } from 'gulp'
import sass from 'sass'  // Directamente importamos 'sass' ahora
import gulpSass from 'gulp-sass'  // Usamos gulp-sass con la nueva API

const sassCompiler = gulpSass(sass)  // Pasamos 'sass' a gulp-sass para usar la nueva API

import terser from 'gulp-terser'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg';

export async function videos(done) {
    const inputFolder = 'src/videos';
    const outputFolder = 'build/videos';

    // Verifica que la carpeta de salida exista
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    // Obtiene los videos en la carpeta de entrada
    const videos = await glob(`${inputFolder}/**/*.{mp4,mov,avi,mkv}`);

    videos.forEach((video) => {
        const outputFile = path.join(outputFolder, path.basename(video));

        // Usa FFmpeg para comprimir el video
        ffmpeg(video)
            .output(outputFile)
            .videoCodec('libx264') // Codec eficiente y ampliamente compatible
            .audioCodec('aac')    // Codec de audio eficiente
            .size('1280x720')    // Mantén resolución Full HD (opcional) size('1920x1080')
            .outputOptions([
                '-crf 23',        // Calidad visual buena y tamaño reducido
                '-preset medium', // Equilibrio entre velocidad y compresión
                '-movflags +faststart' // Optimización para streaming web
            ])
            .on('start', () => console.log(`Processing video: ${video}`))
            .on('end', () => console.log(`Video processed: ${outputFile}`))
            .on('error', (err) => console.error(`Error processing ${video}:`, err))
            .run();
    });

    done();
}

export function js(done) {
    src('src/js/app.js')
        .pipe(terser()) /* terser mimifica el codigo de JS */
        .pipe(dest('build/js'))

    done()
}

export function languages(done) {
    src('src/languages/*.json')
        .pipe(dest('build/languages'))
    done()
}

export function svg(done) {
    src('src/img/*.svg')
        .pipe(dest('build/img'))
    done()
}

export function css(done) {
    src('src/scss/app.scss', { sourcemaps: true })
        .pipe(sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError)) 
        .pipe(dest('build/css', { sourcemaps: '.' }))

    done();
}

export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    // aquí recorta las imágenes
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) { //verifica que exista thumb sino crea la carpeta 
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file)); //revisa que sean imagenes para empezar a procesarlas
    });
    try {
        images.forEach(file => { //empieza a procesar las imagenes 
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile)
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile) //lo almacena en la carpeta 
        });

        done()
    } catch (error) {
        console.log(error)
    }
}

export async function imagenes(done) {  //webp
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images = await glob('./src/img/**/*.{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
    }
    const baseName = path.basename(file, path.extname(file));
    const extName = path.extname(file);
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);

    const options = { quality: 80 };

    // Verifica metadatos de la imagen
    sharp(file)
        .metadata()
        .then((meta) => {
            console.log(`Processing file: ${file}, hasAlpha: ${meta.hasAlpha}`);

            // Si es un PNG, maneja transparencia
            if (extName.toLowerCase() === '.png') {
                sharp(file)
                    .toFormat('png', { compressionLevel: 9, force: true }) // Mantiene transparencia
                    .toFile(outputFile)
                    .then(() => console.log(`Processed PNG: ${file}`))
                    .catch((err) => console.error(`Error processing PNG: ${file}`, err));
            } else {
                // Procesa otros formatos
                sharp(file).jpeg(options).toFile(outputFile);
                sharp(file).webp(options).toFile(outputFileWebp);
                sharp(file).avif().toFile(outputFileAvif);
            }
        })
        .catch((err) => console.error(`Error retrieving metadata: ${file}`, err));
}

export function dev() {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
    watch('src/img/**/*.{png,jpg}', imagenes)
    watch('src/videos/**/*.{mp4,mov,avi,mkv}', videos);
}

/* export default series (crop, js, css, svg, languages, imagenes, dev) */
export default series(js, css, svg, videos, imagenes, dev)
