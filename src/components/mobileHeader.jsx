import { useTheme } from '../context/theme.context';

export default function MobileHeader() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#373B53] dark:bg-[#1E2139] md:hidden"
            style={{ height: '72px' }}
            aria-label="Mobile header"
        >
            {/* Logo */}
            <div
                className="relative flex items-center justify-center bg-purple overflow-hidden"
                style={{ width: '72px', height: '72px', borderRadius: '0 20px 20px 0', flexShrink: 0 }}
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
                    <path d="M20.513 0L28 13L20.513 26H7.487L0 13L7.487 0H20.513Z" fill="white" fillOpacity="0.3" />
                    <path d="M14 5L20 13L14 21L8 13L14 5Z" fill="white" />
                </svg>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-5 pr-5">
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple rounded-full"
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle cx="10" cy="10" r="5" fill="#858BB2" />
                            <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.41 1.41M15.37 15.37l1.41 1.41M3.22 16.78l1.41-1.41M15.37 4.63l1.41-1.41" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"/>
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
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple transition-all">
                    <img src="https://i.pravatar.cc/32?img=12" alt="User avatar" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
}
