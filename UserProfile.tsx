'use client';

import { useState, useEffect } from 'react';
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon, 
         EnvelopeIcon, PhoneIcon, MapPinIcon, BriefcaseIcon,
         CalendarDaysIcon, GlobeAltIcon, UserIcon, TruckIcon,
         ChartBarIcon, StarIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  timezone: string;
  startDate: string;
  bio: string;
  skills: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme: string;
  };
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
  };
}

// Add TMS-specific user stats interface
interface TMSUserStats {
  vehiclesManaged: number;
  routesCreated: number;
  efficiency: number;
  onTimeDeliveries: number;
  totalMileage: number;
  fuelSavings: number;
}

// Mock TMS stats data
const mockTMSStats: TMSUserStats = {
  vehiclesManaged: 45,
  routesCreated: 127,
  efficiency: 98.2,
  onTimeDeliveries: 245,
  totalMileage: 125430,
  fuelSavings: 12500
};

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [userData, setUserData] = useState<UserData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@tms.com',
    phone: '+1 (555) 123-4567',
    role: 'Fleet Manager',
    department: 'Operations',
    location: 'New York, NY',
    timezone: 'EST (UTC-5)',
    startDate: '2022-03-15',
    bio: 'Experienced fleet manager with over 8 years in transportation and logistics. Passionate about optimizing routes and improving operational efficiency.',
    skills: ['Fleet Management', 'Route Optimization', 'Team Leadership', 'Data Analysis', 'Customer Service'],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    },
    preferences: {
      language: 'English',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      theme: 'System'
    }
  });

  const [editForm, setEditForm] = useState<UserData>(userData);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('tms-user-data');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setUserData(parsedData);
        setEditForm(parsedData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Required field validations
    if (!editForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!editForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(editForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!editForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(editForm.phone.replace(/\s|\-|\(|\)/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    // Emergency contact validation
    if (!editForm.emergencyContact.name.trim()) {
      errors.emergencyContact = { ...errors.emergencyContact, name: 'Emergency contact name is required' };
    }
    
    if (!editForm.emergencyContact.phone.trim()) {
      errors.emergencyContact = { ...errors.emergencyContact, phone: 'Emergency contact phone is required' };
    } else if (!phoneRegex.test(editForm.emergencyContact.phone.replace(/\s|\-|\(|\)/g, ''))) {
      errors.emergencyContact = { ...errors.emergencyContact, phone: 'Please enter a valid phone number' };
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('tms-user-data', JSON.stringify(editForm));
      
      // Update state
      setUserData(editForm);
      setIsEditing(false);
      setSaveStatus('success');
      setValidationErrors({});
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(userData);
    setIsEditing(false);
    setValidationErrors({});
    setSaveStatus('idle');
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev as any)[keys[0]],
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev as any)[keys[0]],
            [keys[1]]: {
              ...(prev as any)[keys[0]][keys[1]],
              [keys[2]]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setEditForm(prev => ({ ...prev, skills: skillsArray }));
  };

  const getStatusMessage = () => {
    switch (saveStatus) {
      case 'saving':
        return { message: 'Saving profile...', color: 'text-blue-600' };
      case 'success':
        return { message: 'Profile saved successfully!', color: 'text-green-600' };
      case 'error':
        return { message: 'Error saving profile. Please try again.', color: 'text-red-600' };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-gray-600">{userData.role} • {userData.department}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {statusMessage && (
            <span className={`text-sm ${statusMessage.color} font-medium`}>
              {statusMessage.message}
            </span>
          )}
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveProfile}
                disabled={saveStatus === 'saving'}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {saveStatus === 'saving' ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saveStatus === 'saving'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TMS Performance Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <TruckIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-blue-600">{mockTMSStats.vehiclesManaged}</p>
            <p className="text-xs text-blue-700">Vehicles Managed</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <MapPinIcon className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-600">{mockTMSStats.routesCreated}</p>
            <p className="text-xs text-green-700">Routes Created</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <ChartBarIcon className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-purple-600">{mockTMSStats.efficiency}%</p>
            <p className="text-xs text-purple-700">Efficiency Rate</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <ClockIcon className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-yellow-600">{mockTMSStats.onTimeDeliveries}</p>
            <p className="text-xs text-yellow-700">On-Time Deliveries</p>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <GlobeAltIcon className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-indigo-600">{mockTMSStats.totalMileage.toLocaleString()}</p>
            <p className="text-xs text-indigo-700">Total Miles</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <StarIcon className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-emerald-600">${mockTMSStats.fuelSavings.toLocaleString()}</p>
            <p className="text-xs text-emerald-700">Fuel Savings</p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {validationErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{userData.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{userData.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{userData.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                {isEditing ? (
                  <select
                    value={editForm.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Route Coordinator">Route Coordinator</option>
                    <option value="Driver">Driver</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Maintenance Supervisor">Maintenance Supervisor</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Customer Service">Customer Service</option>
                  </select>
                ) : (
                  <div className="flex items-center">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{userData.role}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                {isEditing ? (
                  <select
                    value={editForm.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Logistics">Logistics</option>
 <option value="Maintenance">Maintenance</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Administration">Administration</option>
                    <option value="IT">IT</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{userData.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{userData.location}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : (
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{new Date(userData.startDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-900">{userData.bio}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter skills separated by commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact & Preferences */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {validationErrors.emergencyContact?.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.emergencyContact.name}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{userData.emergencyContact.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={editForm.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {validationErrors.emergencyContact?.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.emergencyContact.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">{userData.emergencyContact.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                {isEditing ? (
                  <select
                    value={editForm.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{userData.emergencyContact.relationship}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                {isEditing ? (
                  <select
                    value={editForm.preferences.language}
                    onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{userData.preferences.language}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                {isEditing ? (
                  <select
                    value={editForm.preferences.theme}
                    onChange={(e) => handleInputChange('preferences.theme', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="System">System</option>
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{userData.preferences.theme}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notifications
                </label>
                <div className="space-y-2">
                  {Object.entries(userData.preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {key === 'sms' ? 'SMS' : key}
                      </span>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={editForm.preferences.notifications[key as keyof typeof editForm.preferences.notifications]}
                          onChange={(e) => handleInputChange(`preferences.notifications.${key}`, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      ) : (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {value ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TMS Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">TMS Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow">
            <TruckIcon className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Vehicles Managed
              </p>
              <p className="text-xl font-bold text-gray-900">
                {mockTMSStats.vehiclesManaged}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg shadow">
            <ChartBarIcon className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Routes Created
              </p>
              <p className="text-xl font-bold text-gray-900">
                {mockTMSStats.routesCreated}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-yellow-50 rounded-lg shadow">
            <StarIcon className="w-6 h-6 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Efficiency (%)
              </p>
              <p className="text-xl font-bold text-gray-900">
                {mockTMSStats.efficiency}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-red-50 rounded-lg shadow">
            <ClockIcon className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                On-Time Deliveries
              </p>
              <p className="text-xl font-bold text-gray-900">
                {mockTMSStats.onTimeDeliveries}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-purple-50 rounded-lg shadow">
            <ShieldCheckIcon className="w-6 h-6 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Total Mileage
              </p>
              <p className="text-xl font-bold text-gray-900">
                {mockTMSStats.totalMileage}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-indigo-50 rounded-lg shadow">
            <StarIcon className="w-6 h-6 text-indigo-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Fuel Savings (L)
              </p>
              <p className="text-xl font-bold text-gray-900">
                {mockTMSStats.fuelSavings}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
