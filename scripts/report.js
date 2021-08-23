const { Table } = require('console-table-printer')
const path = require('path')
const chalk = require('chalk')
const { getfilesize } = require('./utils')

const statsConfig = {
  // 全部禁用，手动开启，提升效率     
  all: false, 
  // 输出 entry 信息;
  entrypoints: true,
  // 告知 stats 展示 outputPath;
  outputPath: true,
  // 输出 asseets 信息;
  assets: true,
  // 告知 stats 是否添加关于缓存资源的信息;
  cachedAssets: true,
  // 输出 chunks 信息;     
  chunks: true,
  // 告知 stats 展示 chunk 的父 chunk，孩子 chunk 和兄弟 chunk;
  chunkRelations: true,
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


/**
 * @param { object } stats webpack编译后的输出结果JSON
 */
function webpackReport(stats) {
  const statsJSON = stats.toJson(statsConfig)
  const { outputPath, builtAt, time, version, warningsCount, warnings, errors, errorsCount, assets } = statsJSON

  const reportTable = new Table({
    title: 'Build result',
    columns: [
      {
        title: 'State',
        name: 'state',
        alignment: 'left'
      },
      {
        title: 'Value',
        name: 'value',
        alignment: 'left'
      }
    ]
  });
  reportTable.addRow({
    state: 'build status',
    value: errorsCount ? 'fail' : 'success'
  }, {
    color: errorsCount ? 'red' : 'green'
  })
  reportTable.addRows([
    {
      state: 'version',
      value: version
    },
    {
      state: 'builtAt',
      value: new Date(builtAt).toLocaleString()
    },
    {
      state: 'time',
      value: `${time/1000}秒`
    },
    {
      state: 'outputPath',
      value: outputPath
    },
    {
      state: 'warningsCount',
      value: warningsCount
    },
    {
      state: 'errorsCount',
      value: errorsCount
    }
  ])

  if(errorsCount) {
    reportTable.printTable()
    _reportError(errors)
  } else {
    _reportAssets({ assets }, reportTable)
    reportTable.printTable()
  }
  if(warnings && warnings.length) {
    console.log(chalk.yellow.bold('==== ↓ WARNING ↓ ===='))
    warnings.forEach(warningItem => {
      console.log(warningItem.message)
    })
    console.log(chalk.yellow.bold('==== ↑ WARNING ↑ ===='))
  }
}

/**
 * 生成报告所需信息
 * @param { object } reportInfo 
 * @param { object } reportTable 
 */
function _reportAssets (reportInfo, reportTable) {
  const { assets } = reportInfo
  const jsReg = /(js|jsx|ts|tsx)$/i
  const styleReg = /(css)$/i
  const resourceReg = /(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i
  const jsFiles = assets.filter(item => jsReg.test(path.extname(item.name)))
  const styleFiles = assets.filter(item => styleReg.test(path.extname(item.name)))
  const resourceFiles = assets.filter(item => resourceReg.test(path.extname(item.name)))
  const otherFiles = assets.filter(item => {
    const extName = path.extname(item.name)
    return !(jsReg.test(extName) || styleReg.test(extName) || resourceReg.test(extName))
  })
  reportTable.addRow({
    state: '==== ↓ ASSETS ↓ ====',
    value: '==== ↓ SIZE ↓ ===='
  }, {
    color: 'green'
  })
  _renderTableForReportAsset([jsFiles, styleFiles, resourceFiles, otherFiles], reportTable)
}

/**
 * 生成错误报告
 * @param { array } errors 
 */
function _reportError(errors) {
  console.log(chalk.red.bold('==== ↓ ERROR ↓ ===='))
  errors.forEach(errorItem => {
    console.log('File: ', errorItem.file)
    console.log('Detail: ', errorItem.message)
  })
  console.log(chalk.red.bold('==== ↑ ERROR ↑ ===='))
}

/**
 * 生成assets表格报告
 */
function _renderTableForReportAsset (assets, reportTable) {
  if(assets && assets.length) {
    assets.forEach(assetItem => {
      if(Array.isArray(assetItem)) {
        assetItem.forEach(assetItemChild => {
          reportTable.addRow({
            state: assetItemChild.name,
            value: getfilesize(assetItemChild.size)
          })
        })
      } else {
        reportTable.addRow({
          state: item.name,
          value: getfilesize(item.size)
        })
      }
    })
  }
}

module.exports = webpackReport