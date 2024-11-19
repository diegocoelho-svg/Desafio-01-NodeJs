// /users/:id

export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g //expressão regular, forma de encontrar trextos que seguem formato especifico dentro de um texto que é mt maior
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)') // "$1" retorno da posição 1, nome do group
   // console.log(Array.from(path.matchAll(routeParametersRegex)))
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`) 

  return pathRegex
}