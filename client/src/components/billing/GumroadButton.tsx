import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { PackType, CREDIT_PACKS } from '../../types';
import { api } from '../../lib/api';
import { useCredits } from '../../hooks/useCredits';
import { toast } from '../ui/Toast';
import { useAuthStore } from '../../store/authStore';

interface GumroadButtonProps {
  packId: PackType;
  className?: string;
  onSuccess?: () => void;
}

// Map packs to your Gumroad product URLs
// Replace these with your actual Gumroad product permalinks
const GUMROAD_LINKS: Record<string, string> = {
  starter: 'https://gumroad.com/l/REPLYAI_STARTER',   // TODO: set real URL
  pro:     'https://gumroad.com/l/REPLYAI_PRO',
  power:   'https://gumroad.com/l/REPLYAI_POWER',
};

export function GumroadButton({ packId, className, onSuccess }: GumroadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCredits } = useCredits();
  const closePricing = useAuthStore(s => s.closePricing);
  const user = useAuthStore(s => s.user);

  const pack = CREDIT_PACKS.find(p => p.id === packId);

  const handlePurchase = () => {
    if (!pack || !user) return;
    const url = GUMROAD_LINKS[packId];
    if (!url) return;

    // Append email so Gumroad can pre-fill it
    const checkoutUrl = `${url}?email=${encodeURIComponent(user.email || '')}`;

    // Open Gumroad overlay (works via their embed script)
    // Falls back to new tab if overlay not available
    if ((window as any).GumroadOverlay) {
      (window as any).GumroadOverlay.show(checkoutUrl);
    } else {
      window.open(checkoutUrl, '_blank', 'noopener');
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading || !pack}
      className={className}
      variant="primary"
    >
      Pay with Card (Gumroad)
    </Button>
  );
}
