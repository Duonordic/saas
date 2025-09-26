declare module "@dn/eslint-config" {
  import type { Linter } from "eslint";

  export const config: Linter.Config;
  export const nextJsConfig: Linter.Config;
}

declare module "@dn/eslint-config/base" {
  import type { Linter } from "eslint";
  export const config: Linter.Config;
}

declare module "@dn/eslint-config/next-js" {
  import type { Linter } from "eslint";
  export const nextJsConfig: Linter.Config;
}

declare module "@dn/eslint-config/react-internal" {
  import type { Linter } from "eslint";
  export const config: Linter.Config;
}
