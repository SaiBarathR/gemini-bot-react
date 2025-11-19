import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 h-full overflow-hidden relative flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
