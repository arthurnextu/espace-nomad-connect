import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, AlertTriangle, CalendarDays, FileText } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { TOTAL_DESKS, OCCUPIED_DESKS, MONTHLY_REVENUE, PENDING_INVOICES, bookings, invoices, members } from '@/data/mockData';

export default function ManagerDashboard() {
  const occupancyRate = Math.round((OCCUPIED_DESKS / TOTAL_DESKS) * 100);
  const todayBookings = bookings.filter(b => b.date === '2026-03-03');
  const lateInvoices = invoices.filter(i => i.status === 'en retard');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Bonjour, Sarah 👋</h1>
        <p className="text-muted-foreground mt-1">Voici le résumé de votre espace aujourd'hui.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Taux d'occupation"
          value={`${occupancyRate}%`}
          subtitle={`${OCCUPIED_DESKS}/${TOTAL_DESKS} bureaux`}
          icon={<Building2 className="w-5 h-5 text-primary" />}
          variant="primary"
          trend={{ value: '+5% ce mois', positive: true }}
        />
        <StatCard
          title="Revenus mensuels"
          value={`${MONTHLY_REVENUE.toLocaleString('fr-FR')}€`}
          subtitle="Mars 2026"
          icon={<TrendingUp className="w-5 h-5 text-secondary" />}
          variant="accent"
          trend={{ value: '+12%', positive: true }}
        />
        <StatCard
          title="Factures en attente"
          value={PENDING_INVOICES}
          subtitle="À relancer"
          icon={<FileText className="w-5 h-5 text-warning" />}
          variant="warning"
        />
        <StatCard
          title="Membres actifs"
          value={members.length}
          subtitle={`${members.filter(m => m.isOnline).length} en ligne`}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Alert banner */}
      {lateInvoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {lateInvoices.length} facture{lateInvoices.length > 1 ? 's' : ''} en retard
            </p>
            <p className="text-xs text-muted-foreground">
              {lateInvoices.map(i => i.memberName).join(', ')} — Pensez à envoyer un rappel.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's bookings */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Réservations du jour</h2>
          </div>
          <div className="space-y-3">
            {todayBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${booking.status === 'confirmée' ? 'bg-success' : 'bg-warning'}`} />
                  <div>
                    <p className="text-sm font-medium">{booking.memberName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.resourceType === 'bureau' ? `Bureau ${booking.resourceId}` : `Salle ${booking.resourceId}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {booking.startTime} - {booking.endTime}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Occupation map preview */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Plan d'occupation</h2>
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {Array.from({ length: TOTAL_DESKS }, (_, i) => {
              const isOccupied = i < OCCUPIED_DESKS;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium cursor-pointer transition-all hover:scale-110 ${
                    isOccupied
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                  title={`Bureau ${i + 1} — ${isOccupied ? 'Occupé' : 'Libre'}`}
                >
                  {i + 1}
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary" /> Occupé</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted border border-border" /> Libre</span>
          </div>
        </div>
      </div>
    </div>
  );
}
