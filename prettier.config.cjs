/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  printWidth: 100,
  jsxSingleQuote: true,
}

module.exports = config
