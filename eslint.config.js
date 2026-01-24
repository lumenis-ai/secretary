import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default antfu(
  {
    formatters: true,
    react: true,
    rules: {
      'pnpm/json-enforce-catalog': 'off',
      'pnpm/yaml-enforce-settings': 'off',
    },
    ignores: [
      'packages/app/src/components/ui/**',
      'packages/app/src/components/ai-elements/**',
    ],
  },
  ...pluginQuery.configs['flat/recommended'],
)
