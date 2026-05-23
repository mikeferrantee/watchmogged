import expo from "eslint-config-expo/flat.js";

import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  ...expo,
  {
    ignores: ["scripts/**", ".expo/**"],
  },
];
