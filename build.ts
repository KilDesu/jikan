import type { BuildConfig } from 'bun';

const defaultBuildConfing: BuildConfig = {
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
};

const publicTypes = Bun.file('./types/public.d.ts');

await Promise.all([
    Bun.write('./dist/index.d.ts', publicTypes),
    Bun.build({
        ...defaultBuildConfing,
        format: 'esm',
        naming: '[dir]/[name].js',
    }),
    Bun.build({
        ...defaultBuildConfing,
        format: 'cjs',
        naming: '[dir]/[name].cjs',
    }),
]);
