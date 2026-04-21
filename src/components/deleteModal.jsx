import { useEffect, useRef } from 'react';

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
    const cancelRef = useRef(null);

    // Focus trap + ESC close
    useEffect(() => {
        const prev = document.activeElement;
        cancelRef.current?.focus();

        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                onCancel();
            }
            // Trap focus within modal
            if (e.key === 'Tab') {
                const focusable = document.getElementById('delete-modal')?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable || focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            prev?.focus();
        };
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-desc"
            onClick={e => e.target === e.currentTarget && onCancel()}
        >
            <div
                id="delete-modal"
                className="bg-white dark:bg-navy-dark rounded-[8px] p-8 md:p-12 w-full max-w-[480px] animate-scale-in shadow-2xl"
            >
                <h2
                    id="delete-modal-title"
                    className="text-[24px] font-bold leading-[32px] tracking-[-0.5px] text-navy-dark dark:text-white mb-3"
                >
                    Confirm Deletion
                </h2>
                <p
                    id="delete-modal-desc"
                    className="text-[13px] leading-[22px] tracking-[-0.1px] text-bluegray dark:text-bluegray-light mb-8"
                >
                    Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="btn-edit"
                        aria-label="Cancel deletion"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn-danger"
                        aria-label="Confirm deletion"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
