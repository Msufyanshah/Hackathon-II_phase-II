import React, { useState, useEffect } from 'react';
import { BaseComponentProps, User } from '../../lib/types';
import Card from './Card';
import { Heading, Text } from './Typography';
import DataLoader from './DataLoader';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../lib/ApiClient';

export interface UserProfileProps extends BaseComponentProps {
  userId?: string; // If not provided, will use current user
  showActions?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  showActions = false,
  className = '',
}) => {
  const { state: authState } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let userData: User;

        if (userId) {
          // If a specific user ID is provided, we'd need an API endpoint to fetch that user
          // For now, we'll just use the current user if IDs match or if no specific ID is requested
          if (userId === authState.user?.id) {
            userData = authState.user!;
          } else {
            throw new Error('Cannot fetch other users\' profiles with current implementation');
          }
        } else {
          // Use current user
          if (!authState.user) {
            throw new Error('No user is currently authenticated');
          }
          userData = authState.user;
        }

        setUser(userData);
      } catch (err: any) {
        setError(err.message || 'Failed to load user profile');
        console.error('Error loading user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (authState.isAuthenticated) {
      fetchUser();
    } else {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [userId, authState]);

  if (!authState.isAuthenticated) {
    return (
      <Card className={className}>
        <Text variant="muted">Please log in to view user profile</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <Text variant="destructive">{error}</Text>
      </Card>
    );
  }

  if (isLoading || !user) {
    return (
      <Card className={className}>
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-center space-x-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        <div>
          <Heading level={3}>{user.username}</Heading>
          <Text variant="secondary">{user.email}</Text>
          <Text variant="muted" size="sm">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
              Edit Profile
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
              Settings
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserProfile;