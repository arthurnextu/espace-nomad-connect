import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save, FileText, Mail, Phone, Building2 } from 'lucide-react';
import { members, invoices, generateAvatar } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const currentMember = members.find(m => m.id === '2')!;
const memberInvoices = invoices.filter(i => i.memberId === '2');

const statusColors: Record<string, string> = {
  'payée': 'bg-success/10 text-success',
  'en attente': 'bg-warning/10 text-warning',
  'en retard': 'bg-destructive/10 text-destructive',
};

export default function MemberProfile() {
  const [name, setName] = useState(currentMember.name);
  const [role, setRole] = useState(currentMember.role);
  const [company, setCompany] = useState(currentMember.company);
  const [bio, setBio] = useState("Développeur passionné, amateur de café et de clean code. Toujours partant pour un brainstorming !");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Mon Profil</h1>
        <p className="text-muted-foreground mt-1">Gérez vos informations et consultez vos factures.</p>
      </div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <img src={currentMember.avatar} alt={currentMember.name} className="w-20 h-20 rounded-2xl" />
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Nom complet</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Fonction</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div>
                <Label>Entreprise</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Mail className="w-4 h-4" /> {currentMember.email}
                </div>
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="resize-none" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentMember.skills.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
              ))}
            </div>
            <Button onClick={() => toast.success('Profil mis à jour !')} className="gap-2 gradient-primary border-0 text-primary-foreground">
              <Save className="w-4 h-4" /> Enregistrer
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Invoices */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">Mes Factures</h2>
        </div>
        <div className="divide-y divide-border">
          {memberInvoices.map((invoice, i) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="text-sm font-medium">{invoice.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{invoice.amount}€</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[invoice.status]}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
