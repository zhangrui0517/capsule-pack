const statsConfig = {
  // 全部禁用，手动开启，提升效率     
  all: false, 
  // 输出 entry 信息;
  entrypoints: true,
  // 输出 asseets 信息;
  assets: true,
  // 输出 chunks 信息;     
  chunks: true,
  // webpack 版本信息;     
  version: true,
  // 打包用时;
  timings: true,
  // 输出性能相关信息，主要是用到asset是否超过推荐大小 244kb;
  performance: true,
  // 告知 stats 是否展示错误;
  errors:true,
  // 添加展示 errors 个数;
  errorsCount: true,
  // 告知 stats 是否添加错误的详情。如果默认值为 'auto'，当只有 2 个或更少的错误时，它将显示错误详情;
  errorDetails: true,
  // 告知 stats 是否展示错位的栈追踪信息;
  errorStack: true,
  // 告知 stats 添加告警;
  warnings: true,
  // 添加展示 warnings 个数
  warningsCount: true,
  // 告知 stats 展示依赖和告警/错误的来源
  moduleTrace: true,
  // 告知 stats 是否添加日志输出，'info' - 显示错误，告警与信息;
  logging: 'info',
  // 启用错误，告警与追踪的日志输出中的堆栈追踪;
  loggingTrace: true,
  // 显示颜色
  color: true,
  // 告知 stats 是否添加构建日期与时间信息
  builtAt: true,
  // 告知 stats 是否展示 --env 信息
  env: true
}

exports = {
  statsConfig
}