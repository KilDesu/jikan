import type { BuildConfig } from 'bun';
import { createBundle } from 'dts-buddy';

const defaultBuildConfing: BuildConfig = {
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
};

await Promise.all([
    createBundle({
        project: 'tsconfig.json',
        output: 'dist/index.d.ts',
        modules: {
            '@kildesu/jikan': 'types/public.d.ts',
        },
    }),
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
