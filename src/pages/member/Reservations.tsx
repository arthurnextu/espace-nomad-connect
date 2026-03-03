import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { bookings as existingBookings, Booking } from '@/data/mockData';

const HOURS = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

export default function MemberReservations() {
  const [bookingsData, setBookings] = useState(existingBookings);
  const [selectedDate, setSelectedDate] = useState('2026-03-03');
  const [resourceType, setResourceType] = useState<'bureau' | 'salle'>('bureau');
  const [resourceId, setResourceId] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [bookingStep, setBookingStep] = useState<'select' | 'confirm' | 'done'>('select');

  const hasConflict = () => {
    return bookingsData.some(b =>
      b.date === selectedDate &&
      b.resourceType === resourceType &&
      b.resourceId === resourceId &&
      b.startTime < endTime &&
      b.endTime > startTime
    );
  };

  const handleBook = () => {
    if (hasConflict()) {
      toast.error('Ce créneau est déjà réservé. Veuillez en choisir un autre.');
      return;
    }
    setBookingStep('confirm');
  };

  const handleConfirmPayment = () => {
    const newBooking: Booking = {
      id: `b${Date.now()}`,
      memberId: '2',
      memberName: 'Thomas Dupont',
      resourceType,
      resourceId,
      date: selectedDate,
      startTime,
      endTime,
      status: 'confirmée',
    };
    setBookings(prev => [...prev, newBooking]);
    setBookingStep('done');
    toast.success('Réservation confirmée !');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Réserver</h1>
        <p className="text-muted-foreground mt-1">Réservez un bureau ou une salle de réunion.</p>
      </div>

      {bookingStep === 'select' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="w-5 h-5" />
            <h2 className="font-display font-semibold text-lg text-foreground">Nouvelle réservation</h2>
          </div>

          <div>
            <Label>Date</Label>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>

          <div>
            <Label>Type de ressource</Label>
            <Select value={resourceType} onValueChange={(v) => setResourceType(v as 'bureau' | 'salle')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bureau">Bureau</SelectItem>
                <SelectItem value="salle">Salle de réunion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{resourceType === 'bureau' ? 'Numéro du bureau' : 'Salle'}</Label>
            <Select value={String(resourceId)} onValueChange={(v) => setResourceId(parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {resourceType === 'bureau'
                  ? Array.from({ length: 40 }, (_, i) => <SelectItem key={i + 1} value={String(i + 1)}>Bureau {i + 1}</SelectItem>)
                  : [1, 2].map(i => <SelectItem key={i} value={String(i)}>Salle {i}</SelectItem>)
                }
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Début</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{HOURS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fin</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{HOURS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleBook} className="w-full gradient-primary border-0 text-primary-foreground gap-2">
            <Clock className="w-4 h-4" /> Vérifier la disponibilité
          </Button>
        </motion.div>
      )}

      {bookingStep === 'confirm' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2 text-secondary">
            <CreditCard className="w-5 h-5" />
            <h2 className="font-display font-semibold text-lg text-foreground">Confirmation & Paiement</h2>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
            <p><span className="text-muted-foreground">Ressource :</span> {resourceType === 'bureau' ? `Bureau ${resourceId}` : `Salle ${resourceId}`}</p>
            <p><span className="text-muted-foreground">Date :</span> {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <p><span className="text-muted-foreground">Horaire :</span> {startTime} - {endTime}</p>
            <p className="font-semibold pt-2 border-t border-border">Total : {resourceType === 'bureau' ? '15€' : '25€'}</p>
          </div>

          {/* Fake payment form */}
          <div className="space-y-3">
            <div>
              <Label>Numéro de carte</Label>
              <Input placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Expiration</Label><Input placeholder="MM/AA" /></div>
              <div><Label>CVC</Label><Input placeholder="123" /></div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setBookingStep('select')} className="flex-1">Retour</Button>
            <Button onClick={handleConfirmPayment} className="flex-1 gradient-accent border-0 text-accent-foreground gap-2">
              <CreditCard className="w-4 h-4" /> Payer
            </Button>
          </div>
        </motion.div>
      )}

      {bookingStep === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl border border-border p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display text-xl font-bold">Réservation confirmée !</h2>
          <p className="text-sm text-muted-foreground">Votre {resourceType === 'bureau' ? `bureau ${resourceId}` : `salle ${resourceId}`} est réservé(e).</p>
          <Button onClick={() => setBookingStep('select')} variant="outline">Nouvelle réservation</Button>
        </motion.div>
      )}
    </div>
  );
}
