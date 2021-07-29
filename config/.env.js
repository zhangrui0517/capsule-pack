module.exports = (env) => {
  process.env.NODE_ENV = env
  process.env.BUNDLE_PREFIX_PATH = process.cwd()
}