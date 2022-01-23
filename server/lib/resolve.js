import { AuthenticationError, ApolloError } from 'apollo-server-lambda'

const { APP_KEY, APP_ID } = process.env

const getAppId = (headers) => {
  return headers['x-app-id'] || headers['X-App-Id']
}

const getAppKey = (headers) => {
  return headers['x-app-key'] || headers['X-App-Key']
}

const handleError = error => {
  if (error instanceof ApolloError) {
    throw error
  }

  const message = error.data && error.data.message || error.message
  const code = error.data && error.data.errorCode || error.errorCode

  throw new ApolloError(message, code, {
    errorData: error.data && error.data.data || error.data
  })
}

const resolve = async (resolver, settings, ...args) => {
  const { isPrivate = false } = settings || {}
  const [, , context] = args

  const appId = getAppId(context.headers)
  const appKey = getAppKey(context.headers)

  if (isPrivate && (appKey !== APP_KEY || appId !== APP_ID)) {
    throw new AuthenticationError('Unauthorized')
  }

  try {
    return await resolver(...args)
  } catch (error) {
    handleError(error)
  }
}

export default (resolver, settings = {}) => (...args) => resolve(resolver, settings, ...args)
