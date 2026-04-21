import { useTheme } from '../context/theme.context';

export default function Sidebar() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <aside
            className="fixed top-0 left-0 z-50 flex flex-col items-center justify-between bg-[#373B53] dark:bg-[#1E2139]"
            style={{
                width: '72px',
                height: '100vh',
                borderRadius: '0 20px 20px 0',
            }}
            aria-label="Sidebar navigation"
        >
            {/* Logo */}
            <div
                className="relative flex items-center justify-center bg-purple w-full overflow-hidden"
                style={{ height: '72px', borderRadius: '0 20px 20px 0', flexShrink: 0 }}
                aria-label="Invoice App Logo"
            >
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-purple-light rounded-tl-[20px]" />
                <svg
                    className="relative z-10"
                    width="28"
                    height="26"
                    viewBox="0 0 28 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M20.513 0L28 13L20.513 26H7.487L0 13L7.487 0H20.513Z"
                        fill="white"
                        fillOpacity="0.3"
                    />
                    <path
                        d="M14 5L20 13L14 21L8 13L14 5Z"
                        fill="white"
                    />
                </svg>
            </div>

            {/* Bottom controls */}
            <div className="flex flex-col items-center gap-6 pb-6 w-full">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple"
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14A6 6 0 1110 4a6 6 0 010 12z"
                                fill="#858BB2"
                            />
                            <circle cx="10" cy="10" r="4" fill="#858BB2" />
                            <path d="M10 0v2M10 18v2M0 10h2M18 10h2M2.93 2.93l1.41 1.41M15.66 15.66l1.41 1.41M2.93 17.07l1.41-1.41M15.66 4.34l1.41-1.41" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.954.25a.75.75 0 0 0-.91.987 8.5 8.5 0 0 1-9.807 11.52.75.75 0 0 0-.523 1.307A11.5 11.5 0 0 0 19.25 7.5c0-3.587-1.638-6.797-4.213-8.96a.75.75 0 0 0-.083-.29z"
                                fill="#7E88C3"
                            />
                        </svg>
                    )}
                </button>

                {/* Divider */}
                <div className="w-full h-px bg-[#494E6E]" />

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple transition-all">
                    <img
                        src="https://i.pravatar.cc/32?img=12"
                        alt="User avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </aside>
    );
}
