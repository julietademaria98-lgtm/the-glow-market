// Never turn a failed database request into a missing product or course.
export function catalogData<T>(result: { data: T; error: { code?: string } | null }, resource: string): T {
  if (result.error) {
    // Log only the error code: provider messages can contain sensitive details.
    console.error('[catalog]', resource, result.error.code || 'request_failed')
    throw new Error('El catálogo no está disponible temporalmente.')
  }
  return result.data
}
