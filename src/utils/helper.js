// Generate a random invoice ID like "RT3080"
export function generateId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const l1 = letters[Math.floor(Math.random() * 26)];
    const l2 = letters[Math.floor(Math.random() * 26)];
    const nums = Math.floor(1000 + Math.random() * 9000);
    return `${l1}${l2}${nums}`;
}

// Format currency
export function formatCurrency(amount) {
    return `£ ${Number(amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format date: "19 Aug 2021"
export function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Add days to a date string
export function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Today as YYYY-MM-DD
export function today() {
    return new Date().toISOString().split('T')[0];
}

// Calculate item total
export function calcTotal(items = []) {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
}

export const PAYMENT_TERMS = [
    { label: 'Net 1 Day', value: 1 },
    { label: 'Net 7 Days', value: 7 },
    { label: 'Net 14 Days', value: 14 },
    { label: 'Net 30 Days', value: 30 },
];

export const SAMPLE_INVOICES = [
    {
        id: 'RT3080',
        createdAt: '2021-08-18',
        paymentDue: '2021-08-19',
        description: 'Re-branding',
        paymentTerms: 1,
        clientName: 'Jensen Huang',
        clientEmail: 'jensenh@mail.com',
        status: 'paid',
        senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
        clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
        items: [{ id: 1, name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }],
        total: 1800.90,
    },
    {
        id: 'XM9141',
        createdAt: '2021-08-21',
        paymentDue: '2021-09-20',
        description: 'Graphic Design',
        paymentTerms: 30,
        clientName: 'Alex Grim',
        clientEmail: 'alexgrim@mail.com',
        status: 'pending',
        senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
        clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
        items: [
            { id: 1, name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
            { id: 2, name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 },
        ],
        total: 556.00,
    },
    {
        id: 'RG0314',
        createdAt: '2021-09-24',
        paymentDue: '2021-10-01',
        description: 'Website Redesign',
        paymentTerms: 7,
        clientName: 'John Morrison',
        clientEmail: 'jm@myco.com',
        status: 'paid',
        senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
        clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
        items: [
            { id: 1, name: 'Project Fee', quantity: 1, price: 14002.33, total: 14002.33 },
        ],
        total: 14002.33,
    },
    {
        id: 'RT2080',
        createdAt: '2021-10-11',
        paymentDue: '2021-10-12',
        description: 'Logo Concept',
        paymentTerms: 1,
        clientName: 'Alysa Werner',
        clientEmail: 'alysa@email.co.uk',
        status: 'pending',
        senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
        clientAddress: { street: '63 Warwick Road', city: 'Carlisle', postCode: 'CA20 2TG', country: 'United Kingdom' },
        items: [{ id: 1, name: 'Logo Sketches', quantity: 1, price: 102.04, total: 102.04 }],
        total: 102.04,
    },
    {
        id: 'AA1449',
        createdAt: '2021-10-14',
        paymentDue: '2021-10-14',
        description: 'Re-branding',
        paymentTerms: 7,
        clientName: 'Mellisa Clarke',
        clientEmail: 'mellisa.clarke@example.com',
        status: 'pending',
        senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
        clientAddress: { street: '46 Abbey Row', city: 'Cambridge', postCode: 'CB5 6EG', country: 'United Kingdom' },
        items: [
            { id: 1, name: 'New Logo', quantity: 1, price: 1532.33, total: 1532.33 },
            { id: 2, name: 'Brand Guidelines', quantity: 1, price: 2500.00, total: 2500.00 },
        ],
        total: 4032.33,
    },
    {
        id: 'TY9141',
        createdAt: '2021-10-31',
        paymentDue: '2021-10-31',
        description: 'Landing Page Design',
        paymentTerms: 30,
        clientName: 'Thomas Wayne',
        clientEmail: 'thomas@dc.com',
        status: 'pending',
        senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
        clientAddress: { street: '3 Gotham City Blvd', city: 'Gotham', postCode: 'GC1 1AB', country: 'United States' },
        items: [
            { id: 1, name: 'Design', quantity: 1, price: 6155.91, total: 6155.91 },
        ],
        total: 6155.91,
    },
    {
        id: 'FV2353',
        createdAt: '2021-11-12',
        paymentDue: '2021-11-12',
        description: 'Logo Re-design',
        paymentTerms: 7,
        clientName: 'Anita Wainwright',
        clientEmail: 'anita@mail.com',
        status: 'draft',
        senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
        clientAddress: { street: '', city: '', postCode: '', country: '' },
        items: [
            { id: 1, name: 'Logo Redesign', quantity: 1, price: 3102.04, total: 3102.04 },
        ],
        total: 3102.04,
    },
];
