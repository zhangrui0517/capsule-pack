import { getDirFiles, getPkgPath, forFun } from '../../utils/index.js'

export function formatTemplateChoices(
  templateList: Array<{
		template?: string[]
		type: string
	}>
) {
  const result: string[] = []
  forFun(templateList, (item) => {
    const { template, type } = item
    if (template) {
      forFun(template, (templateItem) => {
        result.push(`${templateItem} --- [${type}]`)
      })
    }
  })
  return result
}

export function getTemplateChoices() {
  const innerTemplate = getDirFiles('template', getPkgPath())
  const customTemplate = getDirFiles('template')
  return formatTemplateChoices([
    {
      template: innerTemplate,
      type: 'inner'
    },
    {
      template: customTemplate,
      type: 'custom'
    }
  ])
}
