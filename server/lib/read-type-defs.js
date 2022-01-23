import { readFileSync } from 'fs'
import { extname } from 'path'

const readTypeDefs = (absolutePath) => {
  const ext = extname(absolutePath)
  const pathWExt = ext === 'graphql' ? absolutePath : `${absolutePath}.graphql`
  return readFileSync(pathWExt, 'utf8')
}

export default readTypeDefs