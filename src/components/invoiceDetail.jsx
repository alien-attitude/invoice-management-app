import { useState } from 'react';
import { useInvoices } from '../context/invoice.context';
import StatusBadge from './statusBadge';
import DeleteModal from './deleteModal';
import { formatDate, formatCurrency } from '../utils/helper';

export default function InvoiceDetail({ invoiceId, onBack, onEdit }) {
    const { invoices, deleteInvoice, markAsPaid } = useInvoices();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const invoice = invoices.find(inv => inv.id === invoiceId);

    if (!invoice) {
        return (
            <div className="w-full max-w-[780px] mx-auto px-6 py-14">
                <button onClick={onBack} className="flex items-center gap-4 font-bold text-[13px] text-navy-dark dark:text-white hover:text-bluegray-dark dark:hover:text-bluegray transition-colors mb-8">
                    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
                        <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Go back
                </button>
                <p className="text-bluegray">Invoice not found.</p>
            </div>
        );
    }

    function handleDelete() {
        deleteInvoice(invoiceId);
        setShowDeleteModal(false);
        onBack();
    }

    return (
        <>
            <div className="w-full max-w-[780px] mx-auto px-6 py-14 md:py-16 pb-32 md:pb-16">
                {/* Go back */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-4 font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-navy-dark dark:text-white hover:text-bluegray-dark dark:hover:text-bluegray transition-colors mb-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple rounded"
                    aria-label="Go back to invoice list"
                >
                    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
                        <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Go back
                </button>

                {/* Status bar */}
                <div className="card px-6 md:px-8 py-5 md:py-6 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 md:gap-5 flex-1">
            <span className="text-[13px] text-bluegray dark:text-bluegray-light leading-[15px] tracking-[-0.1px]">
              Status
            </span>
                        <StatusBadge status={invoice.status} />
                    </div>

                    {/* Desktop action buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        {invoice.status === 'pending' && (
                            <button
                                onClick={() => onEdit(invoiceId, false)}
                                className="btn-edit"
                                aria-label={`Edit invoice ${invoiceId}`}
                            >
                                Edit
                            </button>
                        )}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="btn-danger"
                            aria-label={`Delete invoice ${invoiceId}`}
                        >
                            Delete
                        </button>
                        {invoice.status === 'pending' && (
                            <button
                                onClick={() => markAsPaid(invoiceId)}
                                className="btn-primary"
                                aria-label={`Mark invoice ${invoiceId} as paid`}
                            >
                                Mark as Paid
                            </button>
                        )}
                        {invoice.status === 'draft' && (
                            <button
                                onClick={() => onEdit(invoiceId, true)}
                                className="btn-primary"
                                aria-label={`Edit draft invoice ${invoiceId}`}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Invoice details card */}
                <div className="card px-6 md:px-8 py-8 md:py-12">
                    {/* Top: ID, description, sender address */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 md:mb-12">
                        <div>
                            <h2 className="text-[15px] font-bold leading-[24px] tracking-[-0.25px] text-navy-dark dark:text-white mb-1">
                                <span className="text-bluegray">#</span>
                                {invoice.id}
                            </h2>
                            <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px]">
                                {invoice.description}
                            </p>
                        </div>
                        <address className="not-italic text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[18px] tracking-[-0.1px] md:text-right mt-6 md:mt-0">
                            {invoice.senderAddress.street}
                            <br />
                            {invoice.senderAddress.city}
                            <br />
                            {invoice.senderAddress.postCode}
                            <br />
                            {invoice.senderAddress.country}
                        </address>
                    </div>

                    {/* Date grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 md:mb-12">
                        <div>
                            <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] mb-3">
                                Invoice Date
                            </p>
                            <p className="font-bold text-[15px] leading-[20px] tracking-[-0.25px] text-navy-dark dark:text-white">
                                {formatDate(invoice.createdAt)}
                            </p>
                            <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] mb-3 mt-8">
                                Payment Due
                            </p>
                            <p className="font-bold text-[15px] leading-[20px] tracking-[-0.25px] text-navy-dark dark:text-white">
                                {formatDate(invoice.paymentDue)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] mb-3">
                                Bill To
                            </p>
                            <p className="font-bold text-[15px] leading-[20px] tracking-[-0.25px] text-navy-dark dark:text-white mb-2">
                                {invoice.clientName}
                            </p>
                            <address className="not-italic text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[18px] tracking-[-0.1px]">
                                {invoice.clientAddress.street}
                                <br />
                                {invoice.clientAddress.city}
                                <br />
                                {invoice.clientAddress.postCode}
                                <br />
                                {invoice.clientAddress.country}
                            </address>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] mb-3">
                                Sent to
                            </p>
                            <p className="font-bold text-[15px] leading-[20px] tracking-[-0.25px] text-navy-dark dark:text-white">
                                {invoice.clientEmail}
                            </p>
                        </div>
                    </div>

                    {/* Items table */}
                    <div className="rounded-[8px] overflow-hidden">
                        <div className="bg-[#F9FAFE] dark:bg-navy p-6 md:p-8">
                            {/* Table headers (desktop) */}
                            <div className="hidden md:grid grid-cols-[1fr_64px_96px_96px] gap-4 mb-8">
                                <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px]">
                                    Item Name
                                </p>
                                <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] text-center">
                                    QTY.
                                </p>
                                <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] text-right">
                                    Price
                                </p>
                                <p className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] text-right">
                                    Total
                                </p>
                            </div>

                            {/* Items */}
                            <ul className="flex flex-col gap-6 md:gap-8" role="list" aria-label="Invoice items">
                                {invoice.items.map((item, idx) => (
                                    <li key={idx}>
                                        {/* Mobile layout */}
                                        <div className="flex items-center justify-between md:hidden">
                                            <div>
                                                <p className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-navy-dark dark:text-white mb-2">
                                                    {item.name}
                                                </p>
                                                <p className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-bluegray dark:text-bluegray-light">
                                                    {item.quantity} × {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <p className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-navy-dark dark:text-white">
                                                {formatCurrency(item.total)}
                                            </p>
                                        </div>

                                        {/* Desktop layout */}
                                        <div className="hidden md:grid grid-cols-[1fr_64px_96px_96px] gap-4 items-center">
                                            <p className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-navy-dark dark:text-white">
                                                {item.name}
                                            </p>
                                            <p className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-bluegray dark:text-bluegray-light text-center">
                                                {item.quantity}
                                            </p>
                                            <p className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-bluegray dark:text-bluegray-light text-right">
                                                {formatCurrency(item.price)}
                                            </p>
                                            <p className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-navy-dark dark:text-white text-right">
                                                {formatCurrency(item.total)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Total */}
                        <div className="bg-[#373B53] dark:bg-[#0C0E16] px-6 md:px-8 py-6 md:py-8 flex items-center justify-between">
                            <p className="text-[13px] text-white leading-[18px] tracking-[-0.1px]">
                                Amount Due
                            </p>
                            <p className="font-bold text-2xl leading-[32px] tracking-[-0.5px] text-white">
                                {formatCurrency(invoice.total)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile action bar */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-navy-dark px-6 py-5 flex items-center justify-end gap-2 shadow-[0px_-4px_20px_rgba(0,0,0,0.1)] z-30">
                {invoice.status === 'pending' && (
                    <button onClick={() => onEdit(invoiceId, false)} className="btn-edit" aria-label={`Edit invoice ${invoiceId}`}>
                        Edit
                    </button>
                )}
                <button onClick={() => setShowDeleteModal(true)} className="btn-danger" aria-label={`Delete invoice ${invoiceId}`}>
                    Delete
                </button>
                {invoice.status === 'pending' && (
                    <button onClick={() => markAsPaid(invoiceId)} className="btn-primary" aria-label={`Mark invoice ${invoiceId} as paid`}>
                        Mark as Paid
                    </button>
                )}
                {invoice.status === 'draft' && (
                    <button onClick={() => onEdit(invoiceId, true)} className="btn-primary" aria-label="Edit draft">
                        Edit
                    </button>
                )}
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <DeleteModal
                    invoiceId={invoiceId}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
}