export type SortField = 'createdAt' | 'title' | 'priority' | 'deadline'
export type SortDir = 'asc' | 'desc'

interface Props {
    field: SortField
    dir: SortDir
    onField: (f: SortField) => void
    onDir: () => void
}

const LABELS: Record<SortField, string> = {
    createdAt: 'Created',
    title: 'Title',
    priority: 'Priority',
    deadline: 'Deadline',
}

export default function SortBar({ field, dir, onField, onDir }: Props) {
    return (
        <div className="sort-bar">
            <span className="sort-label">Sort</span>
            <select
                className="sort-select"
                value={field}
                onChange={(e) => onField(e.target.value as SortField)}
            >
                {(Object.keys(LABELS) as SortField[]).map((f) => (
                    <option key={f} value={f}>
                        {LABELS[f]}
                    </option>
                ))}
            </select>
            <button
                className="sort-dir-btn"
                onClick={onDir}
                title={dir === 'asc' ? 'Ascending' : 'Descending'}
            >
                {dir === 'asc' ? (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="7" y1="12" x2="7" y2="2" />
                        <polyline points="3,6 7,2 11,6" />
                    </svg>
                ) : (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="7" y1="2" x2="7" y2="12" />
                        <polyline points="3,8 7,12 11,8" />
                    </svg>
                )}
            </button>
        </div>
    )
}
