import delPath from "../utils/delpath";
import { series, parallel, src, dest } from "gulp";
import { pkgPath, componentPath } from "../utils/paths";
import less from "gulp-less";
import autoprefixer from "gulp-autoprefixer";
import run from "../utils/run";
//删除testUI
export const removeDist = () => {
  return delPath(`${pkgPath}/testUI`);
};

export const buildStyle = () => {
  return src(`${componentPath}/src/**/style/**.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(dest(`${pkgPath}/testUI/lib/src`))
    .pipe(dest(`${pkgPath}/testUI/es/src`));
};

export default series(
  async () => removeDist(),
  parallel(
    async () => buildStyle(),
    async () => buildComponent()
  )
);
export const buildComponent = async () => {
  run("pnpm run build", componentPath);
};
