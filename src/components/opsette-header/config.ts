// Opsette Header — per-app configuration for Receipt Maker.
// See ../../../_shared/opsette-header/INTEGRATION.md.

import type { OpsetteHeaderConfig } from "./config.template";

export type { OpsetteHeaderConfig };

export const opsetteHeaderConfig: OpsetteHeaderConfig = {
  toolName: "Receipt Maker",
  brandIconPaths: `
    <line x1="80" y1="104" x2="176" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
    <line x1="80" y1="136" x2="176" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
    <path d="M32,208V56a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V208l-32-16-32,16-32-16L96,208,64,192Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
  `,
};
