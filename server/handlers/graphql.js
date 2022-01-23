import { ApolloServer } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from '../graphql/typeDefs'
import resolvers from '../graphql/resolvers'
import db from '../models'

const startExecution = new Date()

const formatResponse = (response, { operationName, operation = {}, request = {}, context = {} } = {}) => {
    console.log('Request:', JSON.stringify({
        account_id: context.user && context.user.id,
        account_name: context.user && context.user.name,
        operation_type: operation.operation && operation.operation.toUpperCase(),
        operation_name: operationName,
        ...(process.env.DEBUG === 'true' ? { request } : undefined)
    }, null, 2))

    if (process.env.DEBUG === 'true') {
        const now = new Date()
        let executionTime = now - startExecution
        if (executionTime > 1000) {
            executionTime = `${(executionTime / 1000).toFixed(2)} s`
        } else {
            executionTime = `${executionTime} ms`
        }
        response.data = {
            __debug__: {
                timestamp: now.toISOString(),
                executionTime
            },
            ...response.data
        }
    }
    return response
}

const formatError = error => {
    const { message, locations, path, extensions = {} } = error
    const errorBody = {
        code: extensions.code,
        message,
        data: extensions.errorData,
        path,
        locations,
        stacktrace: extensions.exception && extensions.exception.stacktrace
    }
    console.error(errorBody)
    return errorBody
}

const buildContext = ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
})

const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    debug: process.env.DEBUG === 'true',
    formatResponse,
    formatError,
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)

    db.sequelize
        .authenticate()
        .then(() => console.log('Database connected!!'))
        .catch((err) => console.log(err))
})