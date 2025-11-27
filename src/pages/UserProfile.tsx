import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getProfile, updateProfile } from '@/services/UserService';
import type { UserProfile } from '@/services/UserService';

const UserProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
        toast.error('Failed to load profile');
      }
    })();
  }, []);

  const handleChange = (key: keyof UserProfile, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.success('Profile saved');
    } catch (err) {
      console.error('Failed to save profile', err);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white p-8 rounded-lg shadow max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">First name</label>
            <Input value={profile.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Last name</label>
            <Input value={profile.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <Input value={profile.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <Input value={profile.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600">Company</label>
            <Input value={profile.company || ''} onChange={(e) => handleChange('company', e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
