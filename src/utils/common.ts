export function forFun<T>(
	array: Array<T>,
	callback: (
		item: T,
		index: number,
		array: Array<T>
	) => void | boolean | 'continue'
) {
	if (!array) {
		console.error('Error at forFun! invalid param <array>.')
	}
	for (let index = 0, len = array.length; index < len; index++) {
		const result = callback(array[index]!, index, array)
		if (result !== undefined) {
			if (result === false) {
				break
			}
			if (result === 'continue') {
				continue
			}
		}
	}
}
