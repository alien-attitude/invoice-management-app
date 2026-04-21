import { useInvoices } from '../context/invoice.context';
import FilterDropdown from './filterDropdown';
import EmptyState from './emptyState';
import StatusBadge from './statusBadge';
import { formatDate, formatCurrency } from '../utils/helper';

export default function InvoiceList({ onNewInvoice, onViewInvoice }) {
    const { filteredInvoices, filter } = useInvoices();

    const count = filteredInvoices.length;
    const subtitle =
        filter === 'all'
            ? count === 0
                ? 'No invoices'
                : `There are ${count} total invoice${count !== 1 ? 's' : ''}`
            : count === 0
                ? `No ${filter} invoices`
                : `There are ${count} ${filter} invoice${count !== 1 ? 's' : ''}`;

    return (
        <div className="w-full max-w-[780px] mx-auto px-6 py-14 md:py-16">
            {/* Header */}
            <div className="flex items-start justify-between mb-14">
                <div>
                    <h1 className="text-navy-dark dark:text-white mb-1">Invoices</h1>
                    <p className="text-[13px] text-bluegray dark:text-bluegray-light tracking-[-0.1px]">
                        {subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-6 md:gap-10">
                    <FilterDropdown />
                    <button
                        onClick={onNewInvoice}
                        className="btn-primary flex items-center gap-4 pl-2"
                        aria-label="Create new invoice"
                    >
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.313 10.023V6.313h3.71V4.68h-3.71V.97H4.68v3.71H.97v1.633H4.68v3.71h1.633z" fill="#7C5DFA" />
              </svg>
            </span>
                        <span className="hidden sm:inline pr-2">New Invoice</span>
                        <span className="sm:hidden pr-2">New</span>
                    </button>
                </div>
            </div>

            {/* List */}
            {filteredInvoices.length === 0 ? (
                <EmptyState />
            ) : (
                <ul className="flex flex-col gap-4" role="list" aria-label="Invoice list">
                    {filteredInvoices.map(invoice => (
                        <li key={invoice.id}>
                            <button
                                onClick={() => onViewInvoice(invoice.id)}
                                className="w-full text-left card px-6 py-[22px] md:py-0 flex flex-col md:flex-row md:items-center md:h-[72px] gap-6 md:gap-0 border border-transparent hover:border-purple transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple rounded-[8px] group"
                                aria-label={`Invoice ${invoice.id}, ${invoice.clientName}, due ${formatDate(invoice.paymentDue)}, ${formatCurrency(invoice.total)}, status: ${invoice.status}`}
                            >
                                {/* ID */}
                                <span className="font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-navy-dark dark:text-white min-w-[80px]">
                  <span className="text-bluegray">#</span>
                                    {invoice.id}
                </span>

                                {/* Mobile: row with date and client */}
                                <div className="flex items-center justify-between md:contents">
                                    {/* Due date */}
                                    <span className="text-[13px] text-bluegray-dark dark:text-bluegray-light leading-[15px] tracking-[-0.1px] md:flex-1 md:mx-4 lg:mx-8">
                    Due {formatDate(invoice.paymentDue)}
                  </span>

                                    {/* Client name */}
                                    <span className="text-[13px] text-bluegray dark:text-bluegray-light leading-[15px] tracking-[-0.1px] md:flex-1">
                    {invoice.clientName}
                  </span>
                                </div>

                                {/* Mobile: row with amount and badge */}
                                <div className="flex items-center justify-between md:contents">
                                    {/* Amount */}
                                    <span className="font-bold text-[15px] leading-[24px] tracking-[-0.25px] text-navy-dark dark:text-white md:flex-1 md:text-right md:mr-10">
                    {formatCurrency(invoice.total)}
                  </span>

                                    {/* Status badge */}
                                    <div className="md:ml-4">
                                        <StatusBadge status={invoice.status} />
                                    </div>
                                </div>

                                {/* Arrow (desktop only) */}
                                <svg
                                    className="hidden md:block ml-5 flex-shrink-0 text-purple"
                                    width="7"
                                    height="10"
                                    viewBox="0 0 7 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
