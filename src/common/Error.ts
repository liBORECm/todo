interface ErrorCase {
    status: number
    message: string
}

export default {
    NotFound: { status: 404, message: 'Not found' },
    InternalErro: { status: 500, message: 'Internal error' },
} as Record<string, ErrorCase>
