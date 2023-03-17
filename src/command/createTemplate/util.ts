import { getDirFiles, getPkgPath, forFun } from '../../utils/index.js'

export function formatTemplateChoices(
  templateList: Array<{
    template: string[]
    templatePath: string[]
    type: string
  }>
) {
  const choices: string[] = []
  const paths: string[] = []
  forFun(templateList, (item) => {
    const { template, type, templatePath } = item
    forFun(template, (templateItem, index) => {
      choices.push(`${choices.length} ${templateItem} --> [${type}]`)
      paths.push(templatePath[index]!)
    })
  })
  return {
    choices,
    paths
  }
}

export function getTemplateChoices() {
  const { files: innerTemplate, filesPath: innerTemplatePath } =
    getDirFiles({
      dirName: 'template', 
      rootDir: getPkgPath(),
      filterType: 'dir'
    }) || {}
  const { files: customTemplate, filesPath: customTemplatePath } =
    getDirFiles({
      dirName: 'template',
      filterType: 'dir'
    }) || {}
  const result = []
  if (innerTemplate?.length) {
    result.push({
      template: innerTemplate,
      templatePath: innerTemplatePath!,
      type: 'inner'
    })
  }
  if (customTemplate?.length) {
    result.push({
      template: customTemplate,
      templatePath: customTemplatePath!,
      type: 'custom'
    })
  }
  return formatTemplateChoices(result)
}

export function createTemplate(templatePath: string) {
  const templateFiles = getDirFiles({
    dirName: templatePath,
    absolute: true
  })
  console.log('templateFiles: ', templateFiles)
}