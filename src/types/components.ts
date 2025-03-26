import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}
