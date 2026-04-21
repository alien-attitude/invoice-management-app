export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6">
            {/* Illustration */}
            <svg
                className="mb-10 w-[242px] h-[200px]"
                viewBox="0 0 242 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* Face/circle */}
                <ellipse cx="121" cy="102" rx="80" ry="80" fill="#F8F8FB" className="dark:fill-[#252945]" />
                {/* Eyes */}
                <circle cx="99" cy="94" r="5" fill="#888EB0" />
                <circle cx="143" cy="94" r="5" fill="#888EB0" />
                {/* Mouth */}
                <path
                    d="M104 118 Q121 108 138 118"
                    stroke="#888EB0"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Papers/invoices */}
                <rect x="30" y="40" width="70" height="90" rx="8" fill="#DFE3FA" className="dark:fill-[#252945]" opacity="0.6" transform="rotate(-15 30 40)" />
                <rect x="142" y="40" width="70" height="90" rx="8" fill="#DFE3FA" className="dark:fill-[#252945]" opacity="0.6" transform="rotate(15 142 40)" />
                <rect x="76" y="30" width="90" height="110" rx="8" fill="#9277FF" opacity="0.15" />
                <rect x="76" y="30" width="90" height="110" rx="8" fill="none" stroke="#9277FF" strokeWidth="2" opacity="0.3" />
                {/* Lines on paper */}
                <rect x="92" y="55" width="58" height="6" rx="3" fill="#9277FF" opacity="0.3" />
                <rect x="92" y="70" width="40" height="6" rx="3" fill="#9277FF" opacity="0.2" />
                <rect x="92" y="85" width="50" height="6" rx="3" fill="#9277FF" opacity="0.2" />
                <rect x="92" y="100" width="35" height="6" rx="3" fill="#9277FF" opacity="0.2" />
            </svg>

            <h2 className="text-[20px] font-bold text-navy-dark dark:text-white leading-[32px] tracking-[-0.63px] mb-[23px]">
                There is nothing here
            </h2>
            <p className="text-[13px] text-bluegray dark:text-bluegray-light leading-[22px] tracking-[-0.1px] max-w-[220px]">
                Create an invoice by clicking the{' '}
                <strong className="text-navy-dark dark:text-white">New Invoice</strong> button and get
                started
            </p>
        </div>
    );
}
