import DefaultTheme from "vitepress/theme";
import MaryTestUI from "mary-test-ui";

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.use(MaryTestUI);
  },
};
