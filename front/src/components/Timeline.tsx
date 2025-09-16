import React from 'react';

interface TimelineItem {
  id: number;
  newStatus: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  changedAt: string;
  changedBy: {
    id: number;
    name: string;
    role: 'CLIENT' | 'MANAGER';
  };
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const getStatusLabel = (status: string) => {
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'badge badge-success';
      case 'IN_PROGRESS':
        return 'badge badge-warning';
      case 'CLOSED':
        return 'badge badge-error';
      default:
        return 'badge';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Historique des statuts</h3>
      <div className="overflow-x-auto">
        <ul className="timeline">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.id}>
              {isEven ? (
                <>
                  <div className="timeline-start timeline-box">
                    <div className="flex flex-col gap-2">
                      <div className={`${getStatusBadgeClass(item.newStatus)} badge-sm`}>
                        {getStatusLabel(item.newStatus)}
                      </div>
                      <div className="text-xs text-gray-500">
                        par {item.changedBy?.name || 'Utilisateur inconnu'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(item.changedAt)}
                      </div>
                    </div>
                  </div>
                  {!isLast && <hr />}
                </>
              ) : (
                <>
                  <hr />
                  <div className="timeline-end timeline-box">
                    <div className="flex flex-col gap-2">
                      <div className={`${getStatusBadgeClass(item.newStatus)} badge-sm`}>
                        {getStatusLabel(item.newStatus)}
                      </div>
                      <div className="text-xs text-gray-500">
                        par {item.changedBy?.name || 'Utilisateur inconnu'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(item.changedAt)}
                      </div>
                    </div>
                  </div>
                  {!isLast && <hr />}
                </>
              )}
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
