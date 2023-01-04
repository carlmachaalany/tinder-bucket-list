import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { ActiveTab } from "../utils/models";


const Navbar = ({ activeTabState }: any) => {

    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    return (
        <>
            <nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                    <h1 className="flex items-center cursor-pointer">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 mr-3 sm:h-9" alt="Tinder Bucket list Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Tinder Bucket List</span>
                    </h1>
                    <div className="flex md:order-2">
                        <button onClick={() => setOpenMenu(!openMenu)} type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className="ml-auto items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li onClick={() => { activeTabState.setActiveTab(ActiveTab.LogIn) }} className={"cursor-pointer transition ease-in-out " + (activeTabState.activeTab === ActiveTab.LogIn ? 'text-blue-500 scale-125' : 'text-gray-400')}>
                                Account
                            </li>
                            <li onClick={() => { activeTabState.setActiveTab(ActiveTab.Swiping) }} className={"cursor-pointer transition ease-in-out " + (currentUser ? '' : 'hidden ') + (activeTabState.activeTab === ActiveTab.Swiping ? 'text-blue-500 scale-125' : 'text-gray-400')}>
                                Swiping
                            </li>
                            <li onClick={() => { activeTabState.setActiveTab(ActiveTab.BucketList) }} className={"cursor-pointer transition ease-in-out " + (currentUser ? '' : 'hidden ') + (activeTabState.activeTab === ActiveTab.BucketList ? 'text-blue-500 scale-125' : 'text-gray-400')}>
                                My Bucket List
                            </li>
                            <li onClick={() => { activeTabState.setActiveTab(ActiveTab.KanbanBoard) }} className={"cursor-pointer transition ease-in-out " + (currentUser ? '' : 'hidden ') + (activeTabState.activeTab === ActiveTab.KanbanBoard ? 'text-blue-500 scale-125' : 'text-gray-400')}>
                                My Kanban Board
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* Mobile Menu */}
            <div className={"fixed h-full z-20 top-0 w-full left-0" + (openMenu ? '' : ' hidden')}>
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 bg-gray-900 opacity-70" />
                </div>
                <div className="h-full w-full flex">
                    <div className="flex-col m-auto">
                        <button onClick={() => { activeTabState.setActiveTab(ActiveTab.LogIn) }} className={"w-full mx-auto cursor-pointer transition ease-in-out " + (activeTabState.activeTab === ActiveTab.LogIn ? 'text-blue-500 scale-125' : 'text-white')}>
                            Account
                        </button><br />
                        <button onClick={() => { activeTabState.setActiveTab(ActiveTab.Swiping) }} className={"mt-7 w-full mx-auto cursor-pointer transition ease-in-out " + (currentUser ? '' : 'hidden ') + (activeTabState.activeTab === ActiveTab.Swiping ? 'text-blue-500 scale-125' : 'text-white')}>
                            Swiping
                        </button><br />
                        <button onClick={() => { activeTabState.setActiveTab(ActiveTab.BucketList) }} className={"mt-7 w-full mx-auto cursor-pointer transition ease-in-out " + (currentUser ? '' : 'hidden ') + (activeTabState.activeTab === ActiveTab.BucketList ? 'text-blue-500 scale-125' : 'text-white')}>
                            My Bucket List
                        </button><br />
                        <button onClick={() => { activeTabState.setActiveTab(ActiveTab.KanbanBoard) }} className={"mt-7 w-full mx-auto cursor-pointer transition ease-in-out " + (currentUser ? '' : 'hidden ') + (activeTabState.activeTab === ActiveTab.KanbanBoard ? 'text-blue-500 scale-125' : 'text-white')}>
                            My Kanban Board
                        </button><br />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;