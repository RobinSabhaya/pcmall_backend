import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/server.ts'],      
  format: ['esm', 'cjs'],       
  dts: false,                     
  splitting: false,              
  sourcemap: false,               
  clean: true,                   
  minify: true,                 
  outDir: 'dist',                
  target: 'esnext',
  skipNodeModulesBundle: true, 
});
