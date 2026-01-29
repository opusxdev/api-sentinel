import { useStore } from '../store/store';
import { Button } from './Button';

export const Header = () => {
  const { user, logout } = useStore();
  
  return (
    <div className="header">
      <div>
        <h1>Dashboard</h1>
      </div>
      <div className="flex items-center gap-16">
        <span className="text-sm text-gray">{user?.email}</span>
        <Button onClick={logout} size="sm">Logout</Button>
      </div>
    </div>
  );
};