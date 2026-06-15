/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'donor' | 'beneficiary' | 'association' | 'volunteer' | 'center';

export interface UserProfile {
  isAuthenticated: boolean;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  avatarUrl: string;
  itemsPostedCount: number;
  itemsRequestedCount: number;
}

export type ItemCondition = 'new' | 'excellent' | 'good' | 'fair';

export type LoanStatus = 'available' | 'requested' | 'donated';

export interface DonationItem {
  id: string;
  title: string;
  category: string;
  condition: ItemCondition;
  location: string;
  timePosted: string;
  imageUrl: string;
  description: string;
  status: LoanStatus;
  donorName: string;
  coordinates: { x: number; y: number }; // Percentage offsets for map view
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

export interface ChatSession {
  id: string;
  contactName: string;
  contactRole: UserRole;
  contactAvatar: string;
  itemTitle: string;
  lastMessage: string;
  unread: boolean;
  messages: ChatMessage[];
}

export type ActiveTab = 'home' | 'explore' | 'post' | 'messages' | 'profile';
