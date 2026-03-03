import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, Clock, X } from 'lucide-react';
import { bookings as initialBookings, members, Booking } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const HOURS = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
const RESOURCES = [
  ...Array.from({ length: 10 }, (_, i) => ({ id: i + 1, type: 'bureau' as const, label: `Bureau ${i + 1}` })),
  { id: 1, type: 'salle' as const, label: 'Salle Réunion 1' },
  { id: 2, type: 'salle' as const, label: 'Salle Réunion 2' },
];

export default function ManagerReservations() {
  const [bookingsData, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedDate, setSelectedDate] = useState('2026-03-03');
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [newBooking, setNewBooking] = useState<{ memberId: string; resourceType: 'bureau' | 'salle'; resourceId: number; startTime: string; endTime: string }>({ memberId: '', resourceType: 'bureau', resourceId: 1, startTime: '09:00', endTime: '18:00' });

  const filteredBookings = bookingsData.filter(b => b.date === selectedDate);

  const hasConflict = (resourceType: string, resourceId: number, startTime: string, endTime: string, excludeId?: string) => {
    return filteredBookings.some(b =>
      b.id !== excludeId &&
      b.resourceType === resourceType &&
      b.resourceId === resourceId &&
      b.startTime < endTime &&
      b.endTime > startTime
    );
  };

  const handleQuickBook = () => {
    const member = members.find(m => m.id === newBooking.memberId);
    if (!member) { toast.error('Veuillez sélectionner un membre.'); return; }
    if (hasConflict(newBooking.resourceType, newBooking.resourceId, newBooking.startTime, newBooking.endTime)) {
      toast.error('⚠️ Double réservation détectée ! Ce créneau est déjà pris.');
      return;
    }
    const booking: Booking = {
      id: `b${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      ...newBooking,
      date: selectedDate,
      status: 'confirmée',
    };
    setBookings(prev => [...prev, booking]);
    setQuickBookOpen(false);
    toast.success(`Réservation confirmée pour ${member.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Réservations</h1>
          <p className="text-muted-foreground mt-1">Gérez les bureaux et salles de réunion.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Dialog open={quickBookOpen} onOpenChange={setQuickBookOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-accent border-0 text-accent-foreground">
                <Plus className="w-4 h-4" /> Quick Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Nouvelle réservation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Membre</Label>
                  <Select value={newBooking.memberId} onValueChange={(v) => setNewBooking(p => ({ ...p, memberId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner un membre" /></SelectTrigger>
                    <SelectContent>
                      {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ressource</Label>
                  <Select
                    value={`${newBooking.resourceType}-${newBooking.resourceId}`}
                    onValueChange={(v) => {
                      const [type, id] = v.split('-');
                      setNewBooking(p => ({ ...p, resourceType: type as 'bureau' | 'salle', resourceId: parseInt(id) }));
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RESOURCES.map(r => (
                        <SelectItem key={`${r.type}-${r.id}`} value={`${r.type}-${r.id}`}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Début</Label>
                    <Select value={newBooking.startTime} onValueChange={(v) => setNewBooking(p => ({ ...p, startTime: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{HOURS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Fin</Label>
                    <Select value={newBooking.endTime} onValueChange={(v) => setNewBooking(p => ({ ...p, endTime: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{HOURS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleQuickBook} className="w-full gradient-primary border-0 text-primary-foreground">
                  Confirmer la réservation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header hours */}
            <div className="grid grid-cols-[180px_repeat(11,1fr)] border-b border-border">
              <div className="p-3 text-xs font-semibold text-muted-foreground">Ressource</div>
              {HOURS.map(h => (
                <div key={h} className="p-3 text-xs text-center text-muted-foreground border-l border-border">{h}</div>
              ))}
            </div>
            {/* Rows */}
            {RESOURCES.map((resource) => {
              const resourceBookings = filteredBookings.filter(
                b => b.resourceType === resource.type && b.resourceId === resource.id
              );
              return (
                <div key={`${resource.type}-${resource.id}`} className="grid grid-cols-[180px_repeat(11,1fr)] border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="p-3 text-sm font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${resourceBookings.length > 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                    {resource.label}
                  </div>
                  {HOURS.map((hour, hourIdx) => {
                    const booking = resourceBookings.find(b => {
                      const startH = parseInt(b.startTime);
                      const endH = parseInt(b.endTime);
                      const currentH = parseInt(hour);
                      return currentH >= startH && currentH < endH;
                    });
                    const isStart = booking && parseInt(booking.startTime) === parseInt(hour);
                    return (
                      <div key={hour} className="border-l border-border relative min-h-[48px]">
                        {isStart && booking && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            className="absolute inset-y-1 left-0.5 right-0.5 rounded-lg gradient-primary text-primary-foreground px-2 py-1 text-[10px] font-medium z-10 overflow-hidden origin-left"
                            style={{
                              width: `calc(${(parseInt(booking.endTime) - parseInt(booking.startTime))} * 100% - 4px)`,
                            }}
                          >
                            {booking.memberName}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
