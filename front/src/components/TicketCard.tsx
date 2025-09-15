import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  createdById: number;
  creatorName?: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'badge badge-success';
      case 'IN_PROGRESS':
        return 'badge badge-warning';
      case 'CLOSED':
        return 'badge badge-error';
      default:
        return 'badge badge-ghost';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Ouvert';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'CLOSED':
        return 'Fermé';
      default:
        return status;
    }
  };

  const truncatedDescription = ticket.description.length > 20 
    ? ticket.description.substring(0, 20) + '...'
    : ticket.description;

  const handleClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div 
      className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="card-title text-lg font-semibold">{ticket.title}</h3>
          <div className={`${getStatusBadgeClass(ticket.status)}`}>
            {getStatusText(ticket.status)}
          </div>
        </div>
        
        <p className="text-gray-600 mb-3">{truncatedDescription}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>#{ticket.id}</span>
          <div className="text-right">
            <div>{new Date(ticket.createdAt).toLocaleString('fr-FR')}</div>
            {user?.role === 'MANAGER' && ticket.creatorName && (
              <div className="text-xs text-gray-400">
                par {ticket.creatorName}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
