import { useState, useRef, useEffect } from 'react';
import { useInvoices } from '../context/invoice.context';

const STATUS_OPTIONS = ['draft', 'pending', 'paid'];

export default function FilterDropdown() {
    const { filter, setFilter } = useInvoices();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Selected statuses as array for checkboxes
    const selected = filter === 'all' ? [] : [filter];

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        function handleKeyDown(e) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function handleToggle(status) {
        if (filter === status) {
            setFilter('all');
        } else {
            setFilter(status);
        }
    }

    const label = filter === 'all' ? 'Filter by status' : `Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-3 font-bold text-[13px] leading-[15px] tracking-[-0.25px] text-navy-dark dark:text-white hover:text-purple dark:hover:text-purple transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple rounded"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Filter invoices by status"
            >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">Filter</span>
                <svg
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label="Status filter options"
                    aria-multiselectable="true"
                    className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-navy rounded-[8px] shadow-[0px_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0px_10px_20px_rgba(0,0,0,0.25)] p-6 flex flex-col gap-4 animate-scale-in z-50"
                >
                    {STATUS_OPTIONS.map(status => {
                        const isChecked = filter === status;
                        const label = status.charAt(0).toUpperCase() + status.slice(1);
                        return (
                            <label
                                key={status}
                                className="flex items-center gap-[13px] cursor-pointer group"
                                role="option"
                                aria-selected={isChecked}
                            >
                                <div
                                    onClick={() => handleToggle(status)}
                                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-all cursor-pointer ${
                                        isChecked
                                            ? 'bg-purple border-purple'
                                            : 'bg-[#DFE3FA] dark:bg-navy-dark border-transparent group-hover:border-purple'
                                    }`}
                                    role="checkbox"
                                    aria-checked={isChecked}
                                    tabIndex={0}
                                    onKeyDown={e => e.key === ' ' && handleToggle(status)}
                                >
                                    {isChecked && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <span
                                    onClick={() => handleToggle(status)}
                                    className="text-[13px] font-bold text-navy-dark dark:text-white leading-[15px] tracking-[-0.25px] select-none"
                                >
                  {label}
                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
