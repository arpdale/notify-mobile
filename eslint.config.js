import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Guard the wireframe/theme flip: brand color hex must go through DS tokens
      // (var(--color-*)), never be hardcoded. Neutrals (#fff, grays) are allowed;
      // a hex kept as a var() fallback — var(--color-accent,#40CCF2) — is allowed.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Literal[value=/#(40CCF2|41CCF2|339FB8|2F80ED|4A8FE7|EF2149|B4002F|0D2A4B|16A34A|00C16A|EDC948|FA6A0A|DC2626|B3F5D1|BEDBFF|FFC9C9|FFF085|EAC1C3|92680E)/i]:not([value=/var\\(/])",
          message:
            'Hardcoded brand color hex. Use a DS token instead — e.g. var(--color-accent), var(--color-interactive-secondary), var(--color-destructive). Keep the hex only as a var() fallback. See @david-richard/notify-ds tokens.css.',
        },
      ],
    },
  },
])
