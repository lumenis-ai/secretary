import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'pnpm/json-enforce-catalog': 'off',
    'pnpm/yaml-enforce-settings': 'off',
  },
  ignores: [
    'packages/server/src/prisma/**/*.ts',
    'packages/server/prisma/migrations/**/*',
  ],
})
