import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { PackType, CREDIT_PACKS } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface LemonSqueezyButtonProps {
  packId: PackType;
  className?: string;
}

// Replace with your LemonSqueezy checkout URLs (get from Store > Products)
const LEMONSQ_LINKS: Record<string, string> = {
  starter: 'https://replyai.lemonsqueezy.com/checkout/buy/STARTER_UUID',   // TODO: set real UUID
  pro:     'https://replyai.lemonsqueezy.com/checkout/buy/PRO_UUID',
  power:   'https://replyai.lemonsqueezy.com/checkout/buy/POWER_UUID',
};

export function LemonSqueezyButton({ packId, className }: LemonSqueezyButtonProps) {
  const user = useAuthStore(s => s.user);
  const pack = CREDIT_PACKS.find(p => p.id === packId);

  const handleClick = () => {
    if (!pack) return;
    const base = LEMONSQ_LINKS[packId];
    if (!base) return;
    // Pre-fill email for better conversion
    const url = user?.email ? `${base}?checkout[email]=${encodeURIComponent(user.email)}` : base;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!pack}
      className={className}

    >
      💛 Pay with LemonSqueezy
    </Button>
  );
}
