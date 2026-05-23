import expo from "eslint-config-expo/flat.js";

import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  ...expo,
  {
    // SDK 56 scaffold reference code excluded from lint, mirroring the
    // tsconfig exclude (Amendment A11). Revisit during Week 6 EAS pivot.
    ignores: [
      "scripts/**",
      ".expo/**",
      "src/app/explore.tsx",
      "src/components/**",
      "src/hooks/**",
      "src/constants/**",
    ],
  },
];
