import React from 'react';
import { DollarSign, Wrench } from 'lucide-react';

const PaginaFinanceiro = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 opacity-60 select-none animate-in fade-in">
      <div style={{
        background: 'var(--bg-elevated)',
        border: '2px dashed var(--border-bright)',
        borderRadius: '2rem',
        padding: '3rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'center',
      }}>
        <DollarSign size={48} style={{ color: 'var(--accent-bright)' }} />
        <Wrench size={20} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Financeiro
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Em desenvolvimento — em breve disponível
        </p>
      </div>
    </div>
  );
};

export default PaginaFinanceiro;
