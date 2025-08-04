import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],      
  format: ['esm', 'cjs'],       
  dts: true,                     
  splitting: false,              
  sourcemap: true,               
  clean: true,                   
  minify: true,                 
  outDir: 'dist',                
  target: 'esnext',
  skipNodeModulesBundle: true, 
});
