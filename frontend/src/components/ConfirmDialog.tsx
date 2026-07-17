interface Props {
    title: string
    message: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    title,
    message,
    confirmLabel = 'Delete',
    onConfirm,
    onCancel,
}: Props) {
    return (
        <div className="overlay" onClick={onCancel}>
            <div className="dialog" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-title">{title}</div>
                <div className="dialog-body">{message}</div>
                <div className="dialog-actions">
                    <button className="btn btn-ghost" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
