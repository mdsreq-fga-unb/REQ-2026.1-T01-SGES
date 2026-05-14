import { defineConfig } from 'tsup';

export default defineConfig({
  tsconfig: './tsconfig.json',
  entry: ['./src/**/*.ts'],
  splitting: true,
  sourcemap: false,
  clean: true,
  platform: 'node',
  esbuildOptions(options, _context) {
    options.outbase = './src';
    options.external = ['redis-memory-server', 'ioredis'];
  },
  banner: {
    js: '"use strict";\nimport "express-async-errors";',
  },
  target: 'node20',
  format: 'esm',
  treeshake: true,
  outDir: 'build',
});
