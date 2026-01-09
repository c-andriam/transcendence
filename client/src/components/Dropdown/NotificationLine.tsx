import React from 'react'

export interface NotificationLineProps {
    notification: string;
}
const NotificationLine = ({ notification }: NotificationLineProps) => {
    return (
        <li className="p-3 hover:bg-white/5 text-sm text-gray-400 border-b border-gray-800/50">
            {notification}
        </li>
    );
}
export default NotificationLine;