import vue from "@vitejs/plugin-vue"
import path from "path"
import { FileSystemIconLoader } from "unplugin-icons/loaders"
import IconResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vite"
import WindiCSS from "vite-plugin-windicss"

module.exports = defineConfig({
  plugins: [
    vue(),
    WindiCSS({
      root: path.resolve(__dirname),
    }),
    Components({
      dts: "./src/components.d.ts",
      dirs: ["./src/components"],
      directoryAsNamespace: true,
      resolvers: [
        IconResolver({
          prefix: "icon",
          customCollections: ["hopp", "auth", "brands"],
        }),
      ],
    }),
    Icons({
      compiler: "vue3",
      customCollections: {
        hopp: FileSystemIconLoader("../hoppscotch-common/assets/icons"),
        auth: FileSystemIconLoader("../hoppscotch-common/assets/icons/auth"),
        brands: FileSystemIconLoader(
          "../hoppscotch-common/assets/icons/brands"
        ),
      },
    }),
  ], // to process SFC
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "hopp-ui",
      formats: ["es"], // adding 'umd' requires globals set to every external module
      fileName: (format) => `hopp-ui.${format}.js`,
    },
    rollupOptions: {
      // external modules won't be bundled into HoppUI library
      external: ["vue"], // not every external has a global
      output: {
        // disable warning on src/index.ts using both default and named export
        exports: "named",
        // Provide global variables to use in the UMD build
        // for externalized deps (not useful if 'umd' is not in lib.formats)
        globals: {
          vue: "Vue",
        },
      },
    },
    emptyOutDir: false, // to retain the types folder generated by tsc
  },
})
