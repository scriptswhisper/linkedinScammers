import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  User,
  LogOut,
  Menu,
  Shield,
  Home,
  PlusCircle,
  List,
} from "lucide-react";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Scammer Blacklist</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            {/* ... Desktop navigation unchanged ... */}
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Home
              </div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  <div className="flex items-center gap-1">
                    <List className="h-4 w-4" /> Dashboard
                  </div>
                </Link>
                <Link
                  to="/report"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  <div className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" /> Report Scammer
                  </div>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full overflow-hidden p-0 border-1 hover:cursor-pointer"
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username || "Profile"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.error("Failed to load profile image:", e);
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.username || "User"
                            )}&background=random`;
                          }}
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white border border-gray-200 shadow-md"
                    align="end"
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.username}</p>
                      </div>
                    </div>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button>Login with LinkedIn</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu with profile image */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && user?.profilePicture && (
              <div className="h-8 w-8 rounded-full border-2  overflow-hidden">
                <img
                  src={user.profilePicture}
                  alt={user.username || "Profile"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load profile image:", e);
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.username || "User"
                    )}&background=random`;
                  }}
                />
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:cursor-pointer"
                >
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white border border-gray-200 shadow-md"
                align="end"
              >
                <DropdownMenuItem asChild>
                  <Link to="/">Home</Link>
                </DropdownMenuItem>

                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/report">Report Scammer</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Login with LinkedIn</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
