import { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobileHeader';
import InvoiceList from './components/invoiceList';
import InvoiceDetail from './components/invoiceDetail';
import InvoiceForm from './components/invoiceForm';

// View states
const VIEWS = {
  LIST: 'list',
  DETAIL: 'detail',
};

export default function App() {
  const [view, setView] = useState(VIEWS.LIST);
  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editIsDraft, setEditIsDraft] = useState(false);

  function handleViewInvoice(id) {
    setSelectedId(id);
    setView(VIEWS.DETAIL);
  }

  function handleBack() {
    setView(VIEWS.LIST);
    setSelectedId(null);
  }

  function handleNewInvoice() {
    setEditId(null);
    setEditIsDraft(false);
    setFormOpen(true);
  }

  function handleEditInvoice(id, isDraft = false) {
    setEditId(id);
    setEditIsDraft(isDraft);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditId(null);
    setEditIsDraft(false);
  }

  return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile header */}
        <MobileHeader />

        {/* Main content */}
        <main
            className="md:pl-[103px] pt-[72px] md:pt-0 min-h-screen flex flex-col"
            id="main-content"
        >
          <div className="flex-1 flex flex-col items-center justify-start">
            {view === VIEWS.LIST && (
                <InvoiceList
                    onNewInvoice={handleNewInvoice}
                    onViewInvoice={handleViewInvoice}
                />
            )}
            {view === VIEWS.DETAIL && selectedId && (
                <InvoiceDetail
                    invoiceId={selectedId}
                    onBack={handleBack}
                    onEdit={handleEditInvoice}
                />
            )}
          </div>
        </main>

        {/* Invoice form drawer */}
        {formOpen && (
            <InvoiceForm
                invoiceId={editId}
                isDraftEdit={editIsDraft}
                onClose={handleCloseForm}
            />
        )}
      </div>
  );
}