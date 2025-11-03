import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'

interface AppHeaderProps {
  onLogout: () => void;
  setCurrentPage: (page: string) => void;
}

const getPageTitle = () => {
    // Logic to determine the page title based on the current route or state
    return "Dashboard";
}

function AppHeader({ onLogout, setCurrentPage }: AppHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <div>
                <h2 className="text-2xl">{getPageTitle()}</h2>
                <p className="text-sm text-gray-600">Welcome back to TradieOne</p>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                            <Avatar>
                                <AvatarFallback className="bg-[#3b82f6] text-white">JD</AvatarFallback>
                            </Avatar>
                            <div className="text-sm text-left">
                                <p>{User.displayName}</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setCurrentPage('profile')}>
                            <User size={16} className="mr-2" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                            <Settings size={16} className="mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout}>
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>);
}

export default AppHeader