import { useEffect, useRef, useState } from 'react';
import { useInvoices } from '../context/invoice.context';
import { generateId, today, addDays, calcTotal, PAYMENT_TERMS } from '../utils/helper';

const EMPTY_ITEM = { id: Date.now(), name: '', quantity: 1, price: 0, total: 0 };

const EMPTY_FORM = {
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    clientName: '',
    clientEmail: '',
    clientStreet: '',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    createdAt: today(),
    paymentTerms: 30,
    description: '',
    items: [{ ...EMPTY_ITEM, id: 1 }],
};

function invoiceToForm(inv) {
    return {
        senderStreet: inv.senderAddress.street,
        senderCity: inv.senderAddress.city,
        senderPostCode: inv.senderAddress.postCode,
        senderCountry: inv.senderAddress.country,
        clientName: inv.clientName,
        clientEmail: inv.clientEmail,
        clientStreet: inv.clientAddress.street,
        clientCity: inv.clientAddress.city,
        clientPostCode: inv.clientAddress.postCode,
        clientCountry: inv.clientAddress.country,
        createdAt: inv.createdAt,
        paymentTerms: inv.paymentTerms,
        description: inv.description,
        items: inv.items.map((item, i) => ({ ...item, id: i + 1 })),
    };
}

function validateForm(form, isDraft = false) {
    const errors = {};
    if (!isDraft) {
        if (!form.clientName.trim()) errors.clientName = "Can't be empty";
        if (!form.clientEmail.trim()) errors.clientEmail = "Can't be empty";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
            errors.clientEmail = 'Must be a valid email';
        if (!form.description.trim()) errors.description = "Can't be empty";
        if (!form.senderStreet.trim()) errors.senderStreet = "Can't be empty";
        if (!form.senderCity.trim()) errors.senderCity = "Can't be empty";
        if (!form.senderPostCode.trim()) errors.senderPostCode = "Can't be empty";
        if (!form.senderCountry.trim()) errors.senderCountry = "Can't be empty";
        if (!form.clientStreet.trim()) errors.clientStreet = "Can't be empty";
        if (!form.clientCity.trim()) errors.clientCity = "Can't be empty";
        if (!form.clientPostCode.trim()) errors.clientPostCode = "Can't be empty";
        if (!form.clientCountry.trim()) errors.clientCountry = "Can't be empty";
        if (form.items.length === 0) errors.items = 'An item must be added';
        else {
            form.items.forEach((item, idx) => {
                if (!item.name.trim()) errors[`item_name_${idx}`] = "Can't be empty";
                if (!item.quantity || Number(item.quantity) <= 0) errors[`item_qty_${idx}`] = 'Must be > 0';
                if (!item.price || Number(item.price) < 0) errors[`item_price_${idx}`] = 'Must be ≥ 0';
            });
        }
    }
    return errors;
}

export default function InvoiceForm({ invoiceId, isDraftEdit = false, onClose }) {
    const { invoices, addInvoice, updateInvoice } = useInvoices();
    const existingInvoice = invoiceId ? invoices.find(inv => inv.id === invoiceId) : null;
    const isEdit = Boolean(existingInvoice);

    const [form, setForm] = useState(() =>
        existingInvoice ? invoiceToForm(existingInvoice) : { ...EMPTY_FORM, items: [{ ...EMPTY_ITEM }] }
    );
    const [errors, setErrors] = useState({});
    const [hasAttempted, setHasAttempted] = useState(false);

    const panelRef = useRef(null);
    const firstInputRef = useRef(null);

    // Focus first input + focus trap
    useEffect(() => {
        firstInputRef.current?.focus();
        function handleKeyDown(e) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Revalidate on change if already attempted
    useEffect(() => {
        if (hasAttempted) setErrors(validateForm(form));
    }, [form, hasAttempted]);

    function setField(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function setItemField(idx, field, value) {
        setForm(prev => {
            const items = prev.items.map((item, i) => {
                if (i !== idx) return item;
                const updated = { ...item, [field]: value };
                updated.total = (Number(updated.quantity) || 0) * (Number(updated.price) || 0);
                return updated;
            });
            return { ...prev, items };
        });
    }

    function addItem() {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now(), name: '', quantity: 1, price: 0, total: 0 }],
        }));
    }

    function removeItem(idx) {
        setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    }

    function buildInvoice(status) {
        const paymentDue = addDays(form.createdAt, Number(form.paymentTerms));
        const items = form.items.map(item => ({
            ...item,
            quantity: Number(item.quantity),
            price: Number(item.price),
            total: Number(item.quantity) * Number(item.price),
        }));
        return {
            id: isEdit ? existingInvoice.id : generateId(),
            createdAt: form.createdAt,
            paymentDue,
            description: form.description,
            paymentTerms: Number(form.paymentTerms),
            clientName: form.clientName,
            clientEmail: form.clientEmail,
            status,
            senderAddress: {
                street: form.senderStreet,
                city: form.senderCity,
                postCode: form.senderPostCode,
                country: form.senderCountry,
            },
            clientAddress: {
                street: form.clientStreet,
                city: form.clientCity,
                postCode: form.clientPostCode,
                country: form.clientCountry,
            },
            items,
            total: calcTotal(items),
        };
    }

    function handleSaveAsDraft() {
        const invoice = buildInvoice('draft');
        if (isEdit) updateInvoice(invoice);
        else addInvoice(invoice);
        onClose();
    }

    function handleSaveAndSend() {
        setHasAttempted(true);
        const errs = validateForm(form, false);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            panelRef.current?.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        // Always produce a pending invoice — promotes drafts and preserves pending status
        const status = isEdit && existingInvoice.status === 'pending' ? 'pending' : 'pending';
        const invoice = buildInvoice(status);
        if (isEdit) updateInvoice(invoice);
        else addInvoice(invoice);
        onClose();
    }

    function handleUpdate() {
        setHasAttempted(true);
        const errs = validateForm(form, false);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        const invoice = buildInvoice(existingInvoice.status);
        updateInvoice(invoice);
        onClose();
    }

    const hasItemError = Object.keys(errors).some(k => k.startsWith('item_'));

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="fixed top-[72px] md:top-0 left-0 md:left-[103px] h-[calc(100vh-72px)] md:h-full w-full max-w-full md:max-w-[616px] bg-white dark:bg-background-dark z-50 overflow-y-auto animate-slide-in"
                style={{ borderRadius: '0 20px 20px 0' }}
                role="dialog"
                aria-modal="true"
                aria-label={isEdit ? `Edit invoice ${invoiceId}` : 'New Invoice'}
            >
                <div className="px-6 md:px-14 pt-8 md:pt-14 pb-32">
                    <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.5px] text-navy-dark dark:text-white mb-10 md:mb-12">
                        {isEdit ? (
                            <>
                                Edit <span className="text-bluegray">#</span>
                                {invoiceId}
                            </>
                        ) : (
                            'New Invoice'
                        )}
                    </h2>

                    <form onSubmit={e => e.preventDefault()} noValidate>
                        {/* Bill From */}
                        <fieldset className="mb-10 md:mb-12">
                            <legend className="text-[13px] font-bold text-purple leading-[15px] tracking-[-0.25px] mb-6">
                                Bill From
                            </legend>
                            <div className="flex flex-col gap-6">
                                <FormField
                                    label="Street Address"
                                    error={errors.senderStreet}
                                    id="senderStreet"
                                >
                                    <input
                                        ref={firstInputRef}
                                        id="senderStreet"
                                        type="text"
                                        value={form.senderStreet}
                                        onChange={e => setField('senderStreet', e.target.value)}
                                        className={`form-input ${errors.senderStreet ? 'form-input-error' : ''}`}
                                        aria-invalid={!!errors.senderStreet}
                                        aria-describedby={errors.senderStreet ? 'senderStreet-error' : undefined}
                                    />
                                </FormField>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <FormField label="City" error={errors.senderCity} id="senderCity">
                                        <input
                                            id="senderCity"
                                            type="text"
                                            value={form.senderCity}
                                            onChange={e => setField('senderCity', e.target.value)}
                                            className={`form-input ${errors.senderCity ? 'form-input-error' : ''}`}
                                            aria-invalid={!!errors.senderCity}
                                        />
                                    </FormField>
                                    <FormField label="Post Code" error={errors.senderPostCode} id="senderPostCode">
                                        <input
                                            id="senderPostCode"
                                            type="text"
                                            value={form.senderPostCode}
                                            onChange={e => setField('senderPostCode', e.target.value)}
                                            className={`form-input ${errors.senderPostCode ? 'form-input-error' : ''}`}
                                            aria-invalid={!!errors.senderPostCode}
                                        />
                                    </FormField>
                                    <FormField label="Country" error={errors.senderCountry} id="senderCountry" className="col-span-2 md:col-span-1">
                                        <input
                                            id="senderCountry"
                                            type="text"
                                            value={form.senderCountry}
                                            onChange={e => setField('senderCountry', e.target.value)}
                                            className={`form-input ${errors.senderCountry ? 'form-input-error' : ''}`}
                                            aria-invalid={!!errors.senderCountry}
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </fieldset>

                        {/* Bill To */}
                        <fieldset className="mb-10 md:mb-12">
                            <legend className="text-[13px] font-bold text-purple leading-[15px] tracking-[-0.25px] mb-6">
                                Bill To
                            </legend>
                            <div className="flex flex-col gap-6">
                                <FormField label="Client's Name" error={errors.clientName} id="clientName">
                                    <input
                                        id="clientName"
                                        type="text"
                                        value={form.clientName}
                                        onChange={e => setField('clientName', e.target.value)}
                                        className={`form-input ${errors.clientName ? 'form-input-error' : ''}`}
                                        aria-invalid={!!errors.clientName}
                                    />
                                </FormField>
                                <FormField label="Client's Email" error={errors.clientEmail} id="clientEmail">
                                    <input
                                        id="clientEmail"
                                        type="email"
                                        value={form.clientEmail}
                                        onChange={e => setField('clientEmail', e.target.value)}
                                        placeholder="e.g. email@example.com"
                                        className={`form-input ${errors.clientEmail ? 'form-input-error' : ''}`}
                                        aria-invalid={!!errors.clientEmail}
                                    />
                                </FormField>
                                <FormField label="Street Address" error={errors.clientStreet} id="clientStreet">
                                    <input
                                        id="clientStreet"
                                        type="text"
                                        value={form.clientStreet}
                                        onChange={e => setField('clientStreet', e.target.value)}
                                        className={`form-input ${errors.clientStreet ? 'form-input-error' : ''}`}
                                        aria-invalid={!!errors.clientStreet}
                                    />
                                </FormField>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <FormField label="City" error={errors.clientCity} id="clientCity">
                                        <input
                                            id="clientCity"
                                            type="text"
                                            value={form.clientCity}
                                            onChange={e => setField('clientCity', e.target.value)}
                                            className={`form-input ${errors.clientCity ? 'form-input-error' : ''}`}
                                            aria-invalid={!!errors.clientCity}
                                        />
                                    </FormField>
                                    <FormField label="Post Code" error={errors.clientPostCode} id="clientPostCode">
                                        <input
                                            id="clientPostCode"
                                            type="text"
                                            value={form.clientPostCode}
                                            onChange={e => setField('clientPostCode', e.target.value)}
                                            className={`form-input ${errors.clientPostCode ? 'form-input-error' : ''}`}
                                            aria-invalid={!!errors.clientPostCode}
                                        />
                                    </FormField>
                                    <FormField label="Country" error={errors.clientCountry} id="clientCountry" className="col-span-2 md:col-span-1">
                                        <input
                                            id="clientCountry"
                                            type="text"
                                            value={form.clientCountry}
                                            onChange={e => setField('clientCountry', e.target.value)}
                                            className={`form-input ${errors.clientCountry ? 'form-input-error' : ''}`}
                                            aria-invalid={!!errors.clientCountry}
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </fieldset>

                        {/* Invoice Details */}
                        <fieldset className="mb-10 md:mb-12">
                            <legend className="sr-only">Invoice Details</legend>
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label="Invoice Date" id="createdAt">
                                        <input
                                            id="createdAt"
                                            type="date"
                                            value={form.createdAt}
                                            onChange={e => setField('createdAt', e.target.value)}
                                            className="form-input"
                                            aria-label="Invoice date"
                                        />
                                    </FormField>
                                    <FormField label="Payment Terms" id="paymentTerms">
                                        <div className="relative">
                                            <select
                                                id="paymentTerms"
                                                value={form.paymentTerms}
                                                onChange={e => setField('paymentTerms', Number(e.target.value))}
                                                className="form-input appearance-none pr-10 cursor-pointer"
                                                aria-label="Payment terms"
                                            >
                                                {PAYMENT_TERMS.map(t => (
                                                    <option key={t.value} value={t.value}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
                                                    <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </FormField>
                                </div>
                                <FormField label="Project Description" error={errors.description} id="description">
                                    <input
                                        id="description"
                                        type="text"
                                        value={form.description}
                                        onChange={e => setField('description', e.target.value)}
                                        placeholder="e.g. Graphic Design Service"
                                        className={`form-input ${errors.description ? 'form-input-error' : ''}`}
                                        aria-invalid={!!errors.description}
                                    />
                                </FormField>
                            </div>
                        </fieldset>

                        {/* Item List */}
                        <div className="mb-16">
                            <h3 className="text-[18px] font-bold text-[#777F98] leading-[32px] tracking-[-0.38px] mb-6">
                                Item List
                            </h3>

                            {/* Header (desktop) */}
                            <div className="hidden md:grid grid-cols-[1fr_64px_100px_24px] gap-4 mb-4">
                                <span className="form-label mb-0">Item Name</span>
                                <span className="form-label mb-0">Qty.</span>
                                <span className="form-label mb-0">Price</span>
                                <span className="form-label mb-0">Total</span>
                            </div>

                            {/* Items */}
                            <ul className="flex flex-col gap-10 md:gap-4" aria-label="Invoice items">
                                {form.items.map((item, idx) => (
                                    <li key={item.id}>
                                        {/* Mobile */}
                                        <div className="md:hidden flex flex-col gap-4">
                                            <FormField label="Item Name" error={errors[`item_name_${idx}`]} id={`item_name_${idx}`}>
                                                <input
                                                    id={`item_name_${idx}`}
                                                    type="text"
                                                    value={item.name}
                                                    onChange={e => setItemField(idx, 'name', e.target.value)}
                                                    className={`form-input ${errors[`item_name_${idx}`] ? 'form-input-error' : ''}`}
                                                    aria-invalid={!!errors[`item_name_${idx}`]}
                                                />
                                            </FormField>
                                            <div className="grid grid-cols-[64px_1fr_auto] gap-4 items-end">
                                                <FormField label="Qty." error={errors[`item_qty_${idx}`]} id={`item_qty_${idx}`}>
                                                    <input
                                                        id={`item_qty_${idx}`}
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={e => setItemField(idx, 'quantity', e.target.value)}
                                                        className={`form-input ${errors[`item_qty_${idx}`] ? 'form-input-error' : ''}`}
                                                        aria-invalid={!!errors[`item_qty_${idx}`]}
                                                    />
                                                </FormField>
                                                <FormField label="Price" error={errors[`item_price_${idx}`]} id={`item_price_${idx}`}>
                                                    <input
                                                        id={`item_price_${idx}`}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.price}
                                                        onChange={e => setItemField(idx, 'price', e.target.value)}
                                                        className={`form-input ${errors[`item_price_${idx}`] ? 'form-input-error' : ''}`}
                                                        aria-invalid={!!errors[`item_price_${idx}`]}
                                                    />
                                                </FormField>
                                                <div className="flex flex-col">
                                                    <span className="form-label">Total</span>
                                                    <div className="flex items-center gap-4 h-[48px]">
                            <span className="text-[13px] font-bold text-bluegray dark:text-bluegray-light leading-[15px] tracking-[-0.25px] min-w-[60px]">
                              {(Number(item.quantity) * Number(item.price)).toFixed(2)}
                            </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(idx)}
                                                            className="text-bluegray hover:text-danger transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
                                                            aria-label={`Remove item ${item.name || idx + 1}`}
                                                        >
                                                            <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.476.5L9.298 1H13v1.5H0V1h3.702L4.524.5h3.952zM1 14.5V3h11v11.5c0 .828-.672 1.5-1.5 1.5h-8C1.672 16 1 15.328 1 14.5z" fill="currentColor" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop */}
                                        <div className="hidden md:grid grid-cols-[1fr_64px_100px_24px] gap-4 items-start">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={e => setItemField(idx, 'name', e.target.value)}
                                                    className={`form-input ${errors[`item_name_${idx}`] ? 'form-input-error' : ''}`}
                                                    aria-label={`Item ${idx + 1} name`}
                                                    aria-invalid={!!errors[`item_name_${idx}`]}
                                                />
                                                {errors[`item_name_${idx}`] && (
                                                    <p className="text-[10px] text-danger mt-1">{errors[`item_name_${idx}`]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={e => setItemField(idx, 'quantity', e.target.value)}
                                                    className={`form-input text-center ${errors[`item_qty_${idx}`] ? 'form-input-error' : ''}`}
                                                    aria-label={`Item ${idx + 1} quantity`}
                                                    aria-invalid={!!errors[`item_qty_${idx}`]}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.price}
                                                    onChange={e => setItemField(idx, 'price', e.target.value)}
                                                    className={`form-input ${errors[`item_price_${idx}`] ? 'form-input-error' : ''}`}
                                                    aria-label={`Item ${idx + 1} price`}
                                                    aria-invalid={!!errors[`item_price_${idx}`]}
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 h-[48px]">
                        <span className="text-[13px] font-bold text-bluegray dark:text-bluegray-light leading-[15px]">
                          {(Number(item.quantity) * Number(item.price)).toFixed(2)}
                        </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(idx)}
                                                    className="text-bluegray hover:text-danger transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
                                                    aria-label={`Remove item ${item.name || idx + 1}`}
                                                >
                                                    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.476.5L9.298 1H13v1.5H0V1h3.702L4.524.5h3.952zM1 14.5V3h11v11.5c0 .828-.672 1.5-1.5 1.5h-8C1.672 16 1 15.328 1 14.5z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Item errors */}
                            {errors.items && (
                                <p className="text-[10px] text-danger mt-4 font-medium">{errors.items}</p>
                            )}
                            {hasItemError && (
                                <p className="text-[10px] text-danger mt-2 font-medium">All item fields must be filled</p>
                            )}

                            {/* Add New Item */}
                            <button
                                type="button"
                                onClick={addItem}
                                className="w-full mt-8 py-4 rounded-full bg-[#F9FAFE] dark:bg-navy text-[13px] font-bold text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.25px] hover:bg-bluegray-light dark:hover:bg-navy-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
                                aria-label="Add new item to invoice"
                            >
                                + Add New Item
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bottom action bar */}
                <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-background-dark px-6 md:px-14 py-5 md:py-8 flex items-center shadow-[0px_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0px_-4px_20px_rgba(0,0,0,0.3)]">

                    {/* ── Draft edit: purple Edit was clicked ── */}
                    {isEdit && isDraftEdit && (
                        <div className="flex items-center justify-end gap-2 w-full">
                            <button onClick={onClose} className="btn-edit" type="button" aria-label="Cancel editing draft">
                                Cancel
                            </button>
                            <button onClick={handleSaveAndSend} className="btn-primary" type="button" aria-label="Save draft and mark as pending">
                                Save &amp; Send
                            </button>
                        </div>
                    )}

                    {/* ── Regular edit: gray Edit was clicked ── */}
                    {isEdit && !isDraftEdit && (
                        <div className="flex items-center justify-end gap-2 w-full">
                            <button onClick={onClose} className="btn-edit" type="button" aria-label="Cancel editing">
                                Cancel
                            </button>
                            <button onClick={handleUpdate} className="btn-primary" type="button" aria-label="Save changes">
                                Save Changes
                            </button>
                        </div>
                    )}

                    {/* ── New invoice ── */}
                    {!isEdit && (
                        <div className="flex items-center justify-between w-full gap-2">
                            <button onClick={onClose} className="btn-dark" type="button" aria-label="Discard new invoice">
                                Discard
                            </button>
                            <div className="flex items-center gap-2">
                                <button onClick={handleSaveAsDraft} className="btn-secondary" type="button" aria-label="Save invoice as draft">
                                    Save as Draft
                                </button>
                                <button onClick={handleSaveAndSend} className="btn-primary" type="button" aria-label="Save invoice and send as pending">
                                    Save &amp; Send
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

// Reusable form field with label and error
function FormField({ label, error, id, children, className = '' }) {
    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center justify-between mb-[10px]">
                <label
                    htmlFor={id}
                    className={`text-[13px] font-medium leading-[15px] tracking-[-0.1px] ${
                        error ? 'text-danger' : 'text-bluegray-dark dark:text-bluegray-light'
                    }`}
                >
                    {label}
                </label>
                {error && (
                    <span
                        id={`${id}-error`}
                        role="alert"
                        className="text-[10px] font-medium text-danger"
                    >
            {error}
          </span>
                )}
            </div>
            {children}
        </div>
    );
}