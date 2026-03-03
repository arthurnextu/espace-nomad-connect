import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Filter } from 'lucide-react';
import { invoices as initialInvoices, Invoice } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const statusColors: Record<Invoice['status'], string> = {
  'payée': 'bg-success/10 text-success',
  'en attente': 'bg-warning/10 text-warning',
  'en retard': 'bg-destructive/10 text-destructive',
};

export default function ManagerBilling() {
  const [invoicesData] = useState(initialInvoices);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all'
    ? invoicesData
    : invoicesData.filter(i => i.status === statusFilter);

  const totalRevenue = invoicesData.filter(i => i.status === 'payée').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoicesData.filter(i => i.status !== 'payée').reduce((s, i) => s + i.amount, 0);

  const handleSendInvoice = (invoice: Invoice) => {
    toast.success(`Facture envoyée à ${invoice.memberName} par email.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Facturation</h1>
        <p className="text-muted-foreground mt-1">Gérez les factures et paiements.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Encaissé</p>
          <p className="text-2xl font-bold font-display text-foreground mt-1">{totalRevenue.toLocaleString('fr-FR')}€</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">En attente</p>
          <p className="text-2xl font-bold font-display text-warning mt-1">{totalPending.toLocaleString('fr-FR')}€</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Factures totales</p>
          <p className="text-2xl font-bold font-display text-foreground mt-1">{invoicesData.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="payée">Payées</SelectItem>
            <SelectItem value="en attente">En attente</SelectItem>
            <SelectItem value="en retard">En retard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice list */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.map((invoice, i) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-muted">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{invoice.memberName}</p>
                  <p className="text-xs text-muted-foreground">{invoice.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">{invoice.amount}€ HT</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[invoice.status]}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
                {invoice.status !== 'payée' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => handleSendInvoice(invoice)}
                  >
                    <Send className="w-3.5 h-3.5" /> Envoyer
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
