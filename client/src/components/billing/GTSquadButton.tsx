import React from 'react';
import { Button } from '../ui/Button';
import { PackType, CREDIT_PACKS } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface GTSquadButtonProps {
  packId: PackType;
  className?: string;
}

// Replace with your actual GTSquad checkout links from app.gtsquad.co > Products
const GTSQUAD_LINKS: Record<string, string> = {
  starter: 'https://app.gtsquad.co/checkout/REPLYAI_STARTER',  // TODO: real link
  pro:     'https://app.gtsquad.co/checkout/REPLYAI_PRO',
  power:   'https://app.gtsquad.co/checkout/REPLYAI_POWER',
};

export function GTSquadButton({ packId, className }: GTSquadButtonProps) {
  const user = useAuthStore(s => s.user);
  const pack = CREDIT_PACKS.find(p => p.id === packId);

  const handleClick = () => {
    if (!pack) return;
    const base = GTSQUAD_LINKS[packId];
    if (!base) return;
    const url = user?.email ? `${base}?email=${encodeURIComponent(user.email)}` : base;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <Button onClick={handleClick} disabled={!pack} className={className} variant="primary">
      💳 Pay with GTSquad
    </Button>
  );
}
