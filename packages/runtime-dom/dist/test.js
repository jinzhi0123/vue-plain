// const result = true && (() => 'a')
// const result = true && 'bb'
// const result = 0 && 'bb'
// const result = 'aa' && 'bb'
const result = !!(true && (() => 'a'))

console.log(result)
