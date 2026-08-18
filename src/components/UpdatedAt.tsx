import { formatUpdatedAt } from '../lib/date'

export function UpdatedAt({ iso }: { iso: string }) {
  return <p className="text-sm text-muted">{formatUpdatedAt(iso)}</p>
}
