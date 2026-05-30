export function getApiError(err: any, fallback: string): string {
  const data = err?.response?.data
  if (!data) return fallback
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    return data.detail[0].msg || fallback
  }
  return data.message || fallback
}
