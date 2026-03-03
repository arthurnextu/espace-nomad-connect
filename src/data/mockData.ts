// Mock data for L'Espace Nomad
export interface Member {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  skills: string[];
  subscription: 'Bureau fixe' | 'Bureau flexible' | 'Salle uniquement';
  isOnline: boolean;
  joinDate: string;
}

export interface Booking {
  id: string;
  memberId: string;
  memberName: string;
  resourceType: 'bureau' | 'salle';
  resourceId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmée' | 'en attente' | 'annulée';
}

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'payée' | 'en attente' | 'en retard';
  description: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

const avatarColors = ['#195157', '#dd8b55', '#2a7a83', '#c47a4a', '#1a6b74'];
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

export const generateAvatar = (name: string, index: number = 0) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${avatarColors[index % avatarColors.length].slice(1)}&color=fff&bold=true&size=128`;
};

export const members: Member[] = [
  { id: '1', name: 'Sarah Martin', role: 'Gérante', company: "L'Espace Nomad", email: 'sarah@espacenomad.fr', phone: '06 12 34 56 78', avatar: generateAvatar('Sarah Martin', 0), skills: ['Management', 'Community Building'], subscription: 'Bureau fixe', isOnline: true, joinDate: '2022-01-15' },
  { id: '2', name: 'Thomas Dupont', role: 'Développeur Full-Stack', company: 'FreelanceTech', email: 'thomas@freelancetech.fr', phone: '06 23 45 67 89', avatar: generateAvatar('Thomas Dupont', 1), skills: ['React', 'Node.js', 'TypeScript'], subscription: 'Bureau fixe', isOnline: true, joinDate: '2023-03-10' },
  { id: '3', name: 'Marie Lefèvre', role: 'Designer UX/UI', company: 'Pixel Studio', email: 'marie@pixelstudio.fr', phone: '06 34 56 78 90', avatar: generateAvatar('Marie Lefèvre', 2), skills: ['Figma', 'UI Design', 'User Research'], subscription: 'Bureau fixe', isOnline: true, joinDate: '2023-05-22' },
  { id: '4', name: 'Lucas Bernard', role: 'Consultant Marketing', company: 'GrowthLab', email: 'lucas@growthlab.fr', phone: '06 45 67 89 01', avatar: generateAvatar('Lucas Bernard', 3), skills: ['SEO', 'Growth Hacking', 'Analytics'], subscription: 'Bureau flexible', isOnline: false, joinDate: '2023-07-14' },
  { id: '5', name: 'Camille Rousseau', role: 'Graphiste', company: 'Indépendante', email: 'camille@design.fr', phone: '06 56 78 90 12', avatar: generateAvatar('Camille Rousseau', 4), skills: ['Illustrator', 'Branding', 'Print'], subscription: 'Bureau fixe', isOnline: true, joinDate: '2023-09-01' },
  { id: '6', name: 'Antoine Moreau', role: 'Développeur Mobile', company: 'AppForge', email: 'antoine@appforge.fr', phone: '06 67 89 01 23', avatar: generateAvatar('Antoine Moreau', 0), skills: ['Flutter', 'React Native', 'iOS'], subscription: 'Bureau fixe', isOnline: false, joinDate: '2023-11-18' },
  { id: '7', name: 'Julie Petit', role: 'Rédactrice Web', company: 'ContentFlow', email: 'julie@contentflow.fr', phone: '06 78 90 12 34', avatar: generateAvatar('Julie Petit', 1), skills: ['SEO Writing', 'Copywriting'], subscription: 'Bureau flexible', isOnline: true, joinDate: '2024-01-05' },
  { id: '8', name: 'Nicolas Garcia', role: 'Data Analyst', company: 'DataPulse', email: 'nicolas@datapulse.fr', phone: '06 89 01 23 45', avatar: generateAvatar('Nicolas Garcia', 2), skills: ['Python', 'SQL', 'Tableau'], subscription: 'Bureau fixe', isOnline: true, joinDate: '2024-02-20' },
];

export const bookings: Booking[] = [
  { id: 'b1', memberId: '2', memberName: 'Thomas Dupont', resourceType: 'bureau', resourceId: 1, date: '2026-03-03', startTime: '09:00', endTime: '18:00', status: 'confirmée' },
  { id: 'b2', memberId: '3', memberName: 'Marie Lefèvre', resourceType: 'bureau', resourceId: 2, date: '2026-03-03', startTime: '09:00', endTime: '18:00', status: 'confirmée' },
  { id: 'b3', memberId: '5', memberName: 'Camille Rousseau', resourceType: 'salle', resourceId: 1, date: '2026-03-03', startTime: '14:00', endTime: '16:00', status: 'confirmée' },
  { id: 'b4', memberId: '7', memberName: 'Julie Petit', resourceType: 'bureau', resourceId: 5, date: '2026-03-03', startTime: '09:00', endTime: '13:00', status: 'en attente' },
  { id: 'b5', memberId: '8', memberName: 'Nicolas Garcia', resourceType: 'bureau', resourceId: 8, date: '2026-03-03', startTime: '10:00', endTime: '17:00', status: 'confirmée' },
  { id: 'b6', memberId: '4', memberName: 'Lucas Bernard', resourceType: 'salle', resourceId: 2, date: '2026-03-04', startTime: '09:00', endTime: '11:00', status: 'confirmée' },
];

export const invoices: Invoice[] = [
  { id: 'f1', memberId: '2', memberName: 'Thomas Dupont', amount: 200, date: '2026-03-01', dueDate: '2026-03-15', status: 'payée', description: 'Bureau fixe - Mars 2026' },
  { id: 'f2', memberId: '3', memberName: 'Marie Lefèvre', amount: 200, date: '2026-03-01', dueDate: '2026-03-15', status: 'payée', description: 'Bureau fixe - Mars 2026' },
  { id: 'f3', memberId: '4', memberName: 'Lucas Bernard', amount: 150, date: '2026-03-01', dueDate: '2026-03-15', status: 'en attente', description: 'Bureau flexible - Mars 2026' },
  { id: 'f4', memberId: '5', memberName: 'Camille Rousseau', amount: 200, date: '2026-03-01', dueDate: '2026-03-15', status: 'en retard', description: 'Bureau fixe - Mars 2026' },
  { id: 'f5', memberId: '6', memberName: 'Antoine Moreau', amount: 200, date: '2026-03-01', dueDate: '2026-03-15', status: 'payée', description: 'Bureau fixe - Mars 2026' },
  { id: 'f6', memberId: '7', memberName: 'Julie Petit', amount: 150, date: '2026-03-01', dueDate: '2026-03-15', status: 'en attente', description: 'Bureau flexible - Mars 2026' },
  { id: 'f7', memberId: '8', memberName: 'Nicolas Garcia', amount: 200, date: '2026-03-01', dueDate: '2026-03-15', status: 'payée', description: 'Bureau fixe - Mars 2026' },
];

export const posts: Post[] = [
  {
    id: 'p1',
    authorId: '2',
    authorName: 'Thomas Dupont',
    authorRole: 'Développeur Full-Stack',
    authorAvatar: generateAvatar('Thomas Dupont', 1),
    content: "Salut la team! 👋 Je suis à la recherche d'un designer pour un projet. Des recommandations?",
    createdAt: '2026-03-03T10:30:00',
    likes: 5,
    comments: [
      { id: 'c1', authorName: 'Marie Lefèvre', authorAvatar: generateAvatar('Marie Lefèvre', 2), content: "Hey Thomas ! Ça dépend du type de design, mais je suis dispo pour en discuter autour d'un café ☕", createdAt: '2026-03-03T10:45:00' },
      { id: 'c2', authorName: 'Camille Rousseau', authorAvatar: generateAvatar('Camille Rousseau', 4), content: "Je peux aussi t'aider sur la partie branding si besoin ! Passe au bureau 12 😊", createdAt: '2026-03-03T11:00:00' },
    ],
    liked: false,
  },
  {
    id: 'p2',
    authorId: '1',
    authorName: 'Sarah Martin',
    authorRole: 'Gérante',
    authorAvatar: generateAvatar('Sarah Martin', 0),
    content: "🎉 Nouveauté ! La salle de réunion 2 est désormais équipée d'un écran 4K et d'un système de visioconférence. N'hésitez pas à la réserver pour vos calls clients !",
    createdAt: '2026-03-02T14:00:00',
    likes: 12,
    comments: [
      { id: 'c3', authorName: 'Nicolas Garcia', authorAvatar: generateAvatar('Nicolas Garcia', 2), content: "Super nouvelle ! Merci Sarah 🙌", createdAt: '2026-03-02T14:30:00' },
    ],
    liked: true,
  },
  {
    id: 'p3',
    authorId: '7',
    authorName: 'Julie Petit',
    authorRole: 'Rédactrice Web',
    authorAvatar: generateAvatar('Julie Petit', 1),
    content: "Petit reminder : l'afterwork de vendredi est maintenu ! 🍕🎶 On se retrouve à 18h dans l'espace détente. Qui est partant ?",
    createdAt: '2026-03-01T16:00:00',
    likes: 8,
    comments: [],
    liked: false,
  },
];

export const TOTAL_DESKS = 40;
export const OCCUPIED_DESKS = 32;
export const TOTAL_ROOMS = 2;
export const MONTHLY_REVENUE = 6400;
export const PENDING_INVOICES = 2;
