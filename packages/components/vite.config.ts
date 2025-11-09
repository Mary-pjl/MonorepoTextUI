import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import DefineOptions from "unplugin-vue-define-options/vite";
import { resolve } from "path";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import semver from "semver";
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./index.ts"), // 你的入口文件路径
      fileName: (format: string) => `test-ui.${format}.js`, // 输出文件的命名规则
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue", /\.less/],

      output: [
        {
          //打包成 ES 模块格式，适用于现代 JavaScript 环境
          format: "es",
          //打包后文件名
          entryFileNames: "[name].mjs",
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: "named",
          //配置打包根目录
          dir: "../testUI/es",
        },
        {
          //打包成 CommonJS 模块格式，适用于 Node.js 环境
          format: "cjs",
          //打包后文件名
          entryFileNames: "[name].js",
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: "named",
          //配置打包根目录
          dir: "../testUI/lib",
        },
      ],
    },
  },
  plugins: [
    vue(),
    dts({
      entryRoot: ".",
      outDir: ["../testUI/es", "../testUI/lib"],
      //指定使用的tsconfig.json为我们整个项目根目录下,如果不配置,你也可以在components下新建tsconfig.json
      tsconfigPath: "../../tsconfig.json",
    }),
    DefineOptions(), // 添加 DefineOptions 插件
    {
      name: "style",
      generateBundle(config, bundle) {
        //这里可以获取打包后的文件目录以及代码code
        const keys = Object.keys(bundle);

        for (const key of keys) {
          const bundler: any = bundle[key as any];
          //rollup内置方法,将所有输出文件code中的.less换成.css

          this.emitFile({
            type: "asset",
            fileName: key, //文件名名不变
            source: bundler.code.replace(/\.less/g, ".css"),
          });
        }
      },
    },
    {
      name: "update-package-json",
      closeBundle() {
        const packageJsonPath = path.resolve(__dirname, "package.json");

        if (!existsSync(packageJsonPath)) {
          console.error(
            `Error: package.json file not found at ${packageJsonPath}`
          );
          return;
        }

        // 读取并更新版本号
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        const newVersion = semver.inc(packageJson.version, "patch"); // 自动递增补丁版本号

        // 创建用于发布的 package.json
        const updatedPackageJson = {
          name: "mary-test-ui", // 无作用域的包名
          version: newVersion,
          description:
            packageJson.description || "A Vue 3 UI component library",
          author: packageJson.author || "Your Name",
          license: packageJson.license || "MIT",
          keywords: ["vue3", "components", "ui", "mary-test-ui"],
          main: "lib/index.js",
          module: "es/index.mjs",
          types: "lib/index.d.ts",
          typings: "lib/index.d.ts",
          exports: {
            ".": {
              import: "./es/index.mjs",
              require: "./lib/index.js",
              types: "./lib/index.d.ts",
            },
            "./es": "./es/index.mjs",
            "./lib": "./lib/index.js",
            "./*": "./*",
          },
          files: ["es", "lib"],
          sideEffects: ["**/*.css"],
          peerDependencies: {
            vue: "^3.0.0",
          },
          repository: {
            type: "git",
            url: "https://github.com/Mary-pjl/MonorepoTextUI.git",
          },
          bugs: {
            url: "https://github.com/Mary-pjl/MonorepoTextUI/issues",
          },
          homepage: "https://github.com/Mary-pjl/MonorepoTextUI#readme",
        };

        const outputDir = path.resolve(__dirname, "../testUI");
        const outputPackageJsonPath = path.join(outputDir, "package.json");

        try {
          if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
          }

          // 写入到 testUI 目录
          writeFileSync(
            outputPackageJsonPath,
            JSON.stringify(updatedPackageJson, null, 2)
          );

          // 更新源 package.json 的版本号
          packageJson.version = newVersion;
          writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

          console.log(
            `✅ New version ${newVersion} updated and package.json written to testUI folder.`
          );
        } catch (err: any) {
          console.error(`Error writing package.json: ${err.message}`);
        }
      },
    },
  ],
});
