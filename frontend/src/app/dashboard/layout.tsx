'use client'; // Add this at the top to make the component a Client Component

import { useState } from 'react';
import { FaHome, FaUser, FaCog, FaUpload } from 'react-icons/fa'; // Import icons
import SignOutButton from '../components/SignOutButton';
import OutlookCalendar from '../components/OutlookCalendar';
import Profile from './profile/page';
import SettingsPage from './settingspage/page';
import UploadPage from './upload/page';

export default function DashboardLayoutClient() {
  const [activeSection, setActiveSection] = useState('home'); // Track active section

  return (
    <div className="flex h-screen bg-gray-10-">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white shadow-lg" style={{ backgroundColor: 'rgb(29, 65, 101)' }}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center shadow-md p-1.5 rounded-lg" style={{ backgroundColor: 'rgb(0, 119, 185)' }}>
            Home Screen
          </h2>
        </div>
        <nav className="mt-3 mr-2 flex flex-col items-center space-y-3">
          <button
            onClick={() => setActiveSection('home')}
            className={`font-semibold block px-4 py-2 transition rounded-lg text-center flex items-center space-x-2 ${
              activeSection === 'home' ? 'bg-white text-black shadow-lg px-6 py-3' : 'hover:bg-gray-600'
            }`}
          >
            <FaHome />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`font-semibold block px-4 py-2 transition rounded-lg text-center flex items-center space-x-2 ${
              activeSection === 'profile' ? 'bg-white text-black shadow-lg px-6 py-3' : 'hover:bg-gray-600'
            }`}
          >
            <FaUser />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`font-semibold block px-4 py-2 transition rounded-lg text-center flex items-center space-x-2 ${
              activeSection === 'settings' ? 'bg-white text-black shadow-lg px-6 py-3' : 'hover:bg-gray-600'
            }`}
          >
            <FaCog />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveSection('upload')}
            className={`font-semibold block px-4 py-2 transition rounded-lg text-center flex items-center space-x-2 ${
              activeSection === 'upload' ? 'bg-white text-black shadow-lg px-6 py-3' : 'hover:bg-gray-600'
            }`}
          >
            <FaUpload />
            <span>Upload CSV</span>
          </button>
          <SignOutButton />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Welcome to the Dashboard 🎉</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-bold">Notifications</button>
            <SignOutButton />
          </div>
        </header>

        {/* Conditionally render sections based on activeSection */}
        <div className="p-6 flex-1 overflow-auto">
          {activeSection === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md col-span-1 xl:col-span-2">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Outlook Calendar</h3>
                <OutlookCalendar />
              </div>
            </div>
          )}
          {activeSection === 'profile' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Profile</h3>
              <Profile />
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Settings</h3>
              <SettingsPage />
            </div>
          )}
          {activeSection === 'upload' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Upload CSV/Excel File</h3>
              <UploadPage />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
