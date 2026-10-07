import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)) })

export default [
  { ignores: ['.next/**', 'out/**', 'node_modules/**'] },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Static hosting uses pre-sized local derivatives rather than a runtime image service.
      '@next/next/no-img-element': 'off',
      // Apostrophes in editorial JSX text are ordinary copy, not a rendering defect.
      'react/no-unescaped-entities': 'off',
    },
  },
]
