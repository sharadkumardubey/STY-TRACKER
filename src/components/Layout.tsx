import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsOpen(false);
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin/dashboard" className="hover:underline" onClick={onClick}>
            Dashboard
          </Link>
          <Link to="/admin/results" className="hover:underline" onClick={onClick}>
            Results
          </Link>
          <Link to="/admin/topics" className="hover:underline" onClick={onClick}>
            Topics
          </Link>
          <Link to="/admin/calendar" className="hover:underline" onClick={onClick}>
            Calendar
          </Link>
          <Link to="/admin/users" className="hover:underline" onClick={onClick}>
            Users
          </Link>
        </>
      );
    }

    return (
      <Link to="/user/dashboard" className="hover:underline" onClick={onClick}>
        Dashboard
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <h1 className="text-xl md:text-2xl font-bold">Study Tracker</h1>
            {user && (
              <nav className="hidden md:flex gap-4">
                <NavLinks />
              </nav>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden sm:inline text-sm">
                {user.name} <span className="text-gray-500">({user.role})</span>
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm" className="hidden md:flex">
                Logout
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="flex flex-col gap-4">
                      <div className="text-sm font-medium border-b pb-2">
                        <p>{user.name}</p>
                        <p className="text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <nav className="flex flex-col gap-3">
                        <NavLinks onClick={() => setIsOpen(false)} />
                      </nav>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <Outlet />
      </main>
    </div>
  );
};
