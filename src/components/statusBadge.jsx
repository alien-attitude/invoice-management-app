export default function StatusBadge({ status }) {
    const classes = {
        paid: 'bg-[#33D69F]/[0.06] text-[#33D69F]',
        pending: 'bg-[#FF8F00]/[0.06] text-[#FF8F00]',
        draft: 'bg-[#373B53]/[0.06] text-[#373B53] dark:bg-[#DFE3FA]/[0.06] dark:text-[#DFE3FA]',
    };

    const dotColors = {
        paid: 'bg-[#33D69F]',
        pending: 'bg-[#FF8F00]',
        draft: 'bg-[#373B53] dark:bg-[#DFE3FA]',
    };

    const label = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <span
            className={`inline-flex items-center gap-[10px] rounded-[6px] px-[14px] py-[12px] text-[13px] font-bold leading-[15px] tracking-[-0.25px] min-w-[104px] justify-center ${classes[status] || classes.draft}`}
            aria-label={`Status: ${label}`}
        >
      <span className={`w-2 h-2 rounded-full ${dotColors[status] || dotColors.draft}`} />
            {label}
    </span>
    );
}
