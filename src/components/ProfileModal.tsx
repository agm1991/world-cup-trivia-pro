import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalProfile, hasSavedProfile } from '@/contexts/LocalProfileContext';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Legacy entry point — always routes to the full create-profile page (read-only when already saved). */
export const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const navigate = useNavigate();
  const { profile } = useLocalProfile();

  useEffect(() => {
    if (!open) return;
    onOpenChange(false);
    if (!hasSavedProfile(profile)) {
      navigate('/create-profile');
    }
  }, [open, profile, onOpenChange, navigate]);

  return null;
};
