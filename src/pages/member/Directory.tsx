import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Wifi } from 'lucide-react';
import { members } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MemberDirectory() {
  const [search, setSearch] = useState('');
  const onlineMembers = members.filter(m => m.isOnline);
  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Annuaire des Membres</h1>
        <p className="text-muted-foreground mt-1">Connectez-vous avec la communauté.</p>
      </div>

      {/* Online widget */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-4 h-4 text-success animate-pulse-soft" />
          <h2 className="text-sm font-semibold">Membres en ligne ({onlineMembers.length})</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {onlineMembers.map(m => (
            <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-lg" />
              <div>
                <p className="text-xs font-medium">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher un membre ou une compétence..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-xl object-cover" />
                {member.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-card" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.company}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {member.skills.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs"
                onClick={() => toast.success(`Message envoyé à ${member.name} !`)}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Envoyer un message
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
