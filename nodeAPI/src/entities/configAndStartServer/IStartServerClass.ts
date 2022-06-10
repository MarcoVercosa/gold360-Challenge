import Fastify, { FastifyInstance } from 'fastify'

export interface IStartServerClass {
    CheckQueues: () => Promise<boolean | void>
    RegisterRoutesAndConfig: () => boolean
    CreateUserDefaultOperatorBD: () => void
    StartHTTP: () => Promise<void>
    ShutdownNegociation: () => void
    Execute: () => Promise<FastifyInstance | boolean>
}