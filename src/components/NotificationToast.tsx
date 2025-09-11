import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './ui/Toast';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <ToastProvider>
      {notifications.map((notification) => (
        <Toast key={notification.id} variant={notification.type === 'error' ? 'destructive' : notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'default'}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <ToastDescription>{notification.message}</ToastDescription>
            </div>
          </div>
          <ToastClose onClick={() => removeNotification(notification.id)} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};

export default NotificationToast;