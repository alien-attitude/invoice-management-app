import { createContext, useContext, useEffect, useReducer } from 'react';
import { SAMPLE_INVOICES } from '../utils/helper';

const InvoiceContext = createContext();

const initialState = {
    invoices: [],
    filter: 'all', // 'all' | 'draft' | 'pending' | 'paid'
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOAD':
            return { ...state, invoices: action.payload };
        case 'ADD':
            return { ...state, invoices: [action.payload, ...state.invoices] };
        case 'UPDATE':
            return {
                ...state,
                invoices: state.invoices.map(inv =>
                    inv.id === action.payload.id ? action.payload : inv
                ),
            };
        case 'DELETE':
            return {
                ...state,
                invoices: state.invoices.filter(inv => inv.id !== action.payload),
            };
        case 'MARK_PAID':
            return {
                ...state,
                invoices: state.invoices.map(inv =>
                    inv.id === action.payload ? { ...inv, status: 'paid' } : inv
                ),
            };
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        default:
            return state;
    }
}

export function InvoiceProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('invoice-data');
        if (stored) {
            try {
                dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
            } catch {
                dispatch({ type: 'LOAD', payload: SAMPLE_INVOICES });
            }
        } else {
            dispatch({ type: 'LOAD', payload: SAMPLE_INVOICES });
        }
    }, []);

    // Persist to localStorage when invoices change
    useEffect(() => {
        if (state.invoices.length > 0 || localStorage.getItem('invoice-data') !== null) {
            localStorage.setItem('invoice-data', JSON.stringify(state.invoices));
        }
    }, [state.invoices]);

    const filteredInvoices =
        state.filter === 'all'
            ? state.invoices
            : state.invoices.filter(inv => inv.status === state.filter);

    const addInvoice = invoice => dispatch({ type: 'ADD', payload: invoice });
    const updateInvoice = invoice => dispatch({ type: 'UPDATE', payload: invoice });
    const deleteInvoice = id => dispatch({ type: 'DELETE', payload: id });
    const markAsPaid = id => dispatch({ type: 'MARK_PAID', payload: id });
    const setFilter = filter => dispatch({ type: 'SET_FILTER', payload: filter });

    return (
        <InvoiceContext.Provider
            value={{
                invoices: state.invoices,
                filteredInvoices,
                filter: state.filter,
                addInvoice,
                updateInvoice,
                deleteInvoice,
                markAsPaid,
                setFilter,
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
}

export function useInvoices() {
    return useContext(InvoiceContext);
}
