'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  activities: string[];
  education: { institution: string; degree: string; major: string; startDate: string; endDate?: string; description?: string }[];
  workExperience: { company: string; title: string; startDate: string; endDate?: string; description?: string }[];
  age?: number;
  achievements: string[];
  futureGoals: string;
  isShowcasingWork: boolean;
  lookingForHelp: boolean;
  lookingToHire: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [age, setAge] = useState<number | ''>('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [futureGoals, setFutureGoals] = useState('');
  const [isShowcasingWork, setIsShowcasingWork] = useState(false);
  const [lookingForHelp, setLookingForHelp] = useState(false);
  const [lookingToHire, setLookingToHire] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      setUser(data);
      setName(data.name);
      setBio(data.bio || '');
      setActivities(data.activities || []);
      setEducation(data.education || []);
      setWorkExperience(data.workExperience || []);
      setAge(data.age || '');
      setAchievements(data.achievements || []);
      setFutureGoals(data.futureGoals || '');
      setIsShowcasingWork(data.isShowcasingWork || false);
      setLookingForHelp(data.lookingForHelp || false);
      setLookingToHire(data.lookingToHire || false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, bio, activities, education, workExperience, age, achievements, futureGoals, isShowcasingWork, lookingForHelp, lookingToHire }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error: any) {
      console.error('Logout error:', error.message);
      setError(error.message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="activities" className="block text-sm font-medium text-gray-700">
                    Activities (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="activities"
                    value={activities.join(', ')}
                    onChange={(e) => setActivities(e.target.value.split(', ').map(s => s.trim()))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="achievements" className="block text-sm font-medium text-gray-700">
                    Achievements (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="achievements"
                    value={achievements.join(', ')}
                    onChange={(e) => setAchievements(e.target.value.split(', ').map(s => s.trim()))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="futureGoals" className="block text-sm font-medium text-gray-700">
                    Future Goals
                  </label>
                  <textarea
                    id="futureGoals"
                    value={futureGoals}
                    onChange={(e) => setFutureGoals(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Education Section */}
                <h3 className="text-lg font-medium text-gray-900 mt-6">Education</h3>
                {education.map((edu, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Institution</label>
                    <input type="text" value={edu.institution} onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].institution = e.target.value;
                      setEducation(newEdu);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].degree = e.target.value;
                      setEducation(newEdu);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">Major</label>
                    <input type="text" value={edu.major} onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].major = e.target.value;
                      setEducation(newEdu);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].startDate = e.target.value;
                      setEducation(newEdu);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input type="date" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].endDate = e.target.value;
                      setEducation(newEdu);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea value={edu.description} onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[index].description = e.target.value;
                      setEducation(newEdu);
                    }} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <button type="button" onClick={() => setEducation(education.filter((_, i) => i !== index))} className="text-red-600 hover:text-red-900 text-sm mt-2">
                      Remove Education
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setEducation([...education, { institution: '', degree: '', major: '', startDate: '', endDate: '', description: '' }])} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-2">
                  Add Education
                </button>

                {/* Work Experience Section */}
                <h3 className="text-lg font-medium text-gray-900 mt-6">Work Experience</h3>
                {workExperience.map((work, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input type="text" value={work.company} onChange={(e) => {
                      const newWork = [...workExperience];
                      newWork[index].company = e.target.value;
                      setWorkExperience(newWork);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" value={work.title} onChange={(e) => {
                      const newWork = [...workExperience];
                      newWork[index].title = e.target.value;
                      setWorkExperience(newWork);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" value={work.startDate ? new Date(work.startDate).toISOString().split('T')[0] : ''} onChange={(e) => {
                      const newWork = [...workExperience];
                      newWork[index].startDate = e.target.value;
                      setWorkExperience(newWork);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input type="date" value={work.endDate ? new Date(work.endDate).toISOString().split('T')[0] : ''} onChange={(e) => {
                      const newWork = [...workExperience];
                      newWork[index].endDate = e.target.value;
                      setWorkExperience(newWork);
                    }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea value={work.description} onChange={(e) => {
                      const newWork = [...workExperience];
                      newWork[index].description = e.target.value;
                      setWorkExperience(newWork);
                    }} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    <button type="button" onClick={() => setWorkExperience(workExperience.filter((_, i) => i !== index))} className="text-red-600 hover:text-red-900 text-sm mt-2">
                      Remove Work Experience
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setWorkExperience([...workExperience, { company: '', title: '', startDate: '', endDate: '', description: '' }])} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-2">
                  Add Work Experience
                </button>

                {/* User Intent Toggles */}
                <div className="mt-6">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={isShowcasingWork}
                      onChange={(e) => setIsShowcasingWork(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2">Showcase my work</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={lookingForHelp}
                      onChange={(e) => setLookingForHelp(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2">Looking for help</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={lookingToHire}
                      onChange={(e) => setLookingToHire(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2">Looking to hire</span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserData(); // Revert changes if cancelled
                    }}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                  <p className="mt-1 text-gray-600">{user.bio || 'No bio yet'}</p>
                </div>

                {/* Display Activities */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Activities</h3>
                  <p className="mt-1 text-gray-600">
                    {user.activities && user.activities.length > 0
                      ? user.activities.join(', ')
                      : 'No activities yet'}
                  </p>
                </div>

                {/* Display Age */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Age</h3>
                  <p className="mt-1 text-gray-600">{user.age || 'Not specified'}</p>
                </div>

                {/* Display Achievements */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
                  <p className="mt-1 text-gray-600">
                    {user.achievements && user.achievements.length > 0
                      ? user.achievements.join(', ')
                      : 'No achievements yet'}
                  </p>
                </div>

                {/* Display Future Goals */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Future Goals</h3>
                  <p className="mt-1 text-gray-600">{user.futureGoals || 'No future goals yet'}</p>
                </div>

                {/* Display Education */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                  {user.education && user.education.length > 0 ? (
                    <ul className="mt-1 space-y-2">
                      {user.education.map((edu, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{edu.degree} in {edu.major} from {edu.institution}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                          </p>
                          {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-gray-600">No education details yet</p>
                  )}
                </div>

                {/* Display Work Experience */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                  {user.workExperience && user.workExperience.length > 0 ? (
                    <ul className="mt-1 space-y-2">
                      {user.workExperience.map((work, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{work.title} at {work.company}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(work.startDate).toLocaleDateString()} - {work.endDate ? new Date(work.endDate).toLocaleDateString() : 'Present'}
                          </p>
                          {work.description && <p className="text-gray-600 text-sm mt-1">{work.description}</p>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-gray-600">No work experience details yet</p>
                  )}
                </div>

                {/* Display User Intent Toggles */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Intent</h3>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>Showcasing Work: {user.isShowcasingWork ? 'Yes' : 'No'}</li>
                    <li>Looking for Help: {user.lookingForHelp ? 'Yes' : 'No'}</li>
                    <li>Looking to Hire: {user.lookingToHire ? 'Yes' : 'No'}</li>
                  </ul>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 