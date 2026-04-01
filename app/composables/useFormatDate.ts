export function formatDate(dateString: string, locale: string = 'uk-UA'): string {
  return new Date(dateString).toLocaleDateString(locale)
}
