interface ErrorCase {
    status: number
    message: string
}

export default {
    NotFound: { status: 404, message: 'Not found' },
} as Record<string, ErrorCase>
