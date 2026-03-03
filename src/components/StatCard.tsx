import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  variant?: 'default' | 'primary' | 'accent' | 'warning';
}

const variantStyles = {
  default: 'bg-card border border-border',
  primary: 'gradient-primary text-primary-foreground',
  accent: 'gradient-accent text-accent-foreground',
  warning: 'bg-warning/10 border border-warning/20',
};

export default function StatCard({ title, value, subtitle, icon, trend, variant = 'default' }: StatCardProps) {
  const isLight = variant === 'primary' || variant === 'accent';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-5 ${variantStyles[variant]} shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={`text-xs font-medium uppercase tracking-wider ${isLight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {title}
          </p>
          <p className="text-3xl font-bold font-display">{value}</p>
          {subtitle && (
            <p className={`text-sm ${isLight ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>
          )}
          {trend && (
            <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${trend.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-xl ${isLight ? 'bg-primary-foreground/10' : 'bg-muted'}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
