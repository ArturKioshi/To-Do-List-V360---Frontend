export function formatDate(dateString: string | null): string | null {
  if (!dateString) {
    return null;
  }
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
