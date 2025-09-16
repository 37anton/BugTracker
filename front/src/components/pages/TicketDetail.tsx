import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/toast/ToastProvider';
import Timeline from '../../components/Timeline';

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

interface Message {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    role: 'CLIENT' | 'MANAGER';
  };
}

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

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { show } = useToast();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingTicket, setIsLoadingTicket] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const fetchTicket = useCallback(async () => {
    if (!token || !id) return;
    
    try {
      setIsLoadingTicket(true);
      const response = await fetch(`http://localhost:3000/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      } else if (response.status === 403) {
        show('Accès refusé à ce ticket', { variant: 'error' });
        navigate('/');
      } else {
        show('Erreur lors du chargement du ticket', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du ticket:', error);
      show('Erreur de connexion', { variant: 'error' });
    } finally {
      setIsLoadingTicket(false);
    }
  }, [token, id, show, navigate]);

  const fetchMessages = useCallback(async () => {
    if (!token || !id) return;
    
    try {
      setIsLoadingMessages(true);
      const response = await fetch(`http://localhost:3000/tickets/${id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else if (response.status === 403) {
        show('Accès refusé aux messages de ce ticket', { variant: 'error' });
      } else {
        show('Erreur lors du chargement des messages', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      show('Erreur de connexion', { variant: 'error' });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [token, id, show]);

  const fetchTimeline = useCallback(async () => {
    if (!token || !id) return;
    
    try {
      setIsLoadingTimeline(true);
      const response = await fetch(`http://localhost:3000/tickets/${id}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data);
      } else if (response.status === 403) {
        show('Accès refusé à l\'historique de ce ticket', { variant: 'error' });
      } else {
        show('Erreur lors du chargement de l\'historique', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      show('Erreur de connexion', { variant: 'error' });
    } finally {
      setIsLoadingTimeline(false);
    }
  }, [token, id, show]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !token || !id) return;

    try {
      setIsSendingMessage(true);
      const response = await fetch(`http://localhost:3000/tickets/${id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (response.ok) {
        setNewMessage('');
        show('Message envoyé !', { variant: 'success' });
        // Recharger les messages
        fetchMessages();
      } else {
        show('Erreur lors de l\'envoi du message', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      show('Erreur de connexion', { variant: 'error' });
    } finally {
      setIsSendingMessage(false);
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

  const canSendMessages = ticket?.status !== 'CLOSED';

  useEffect(() => {
    fetchTicket();
    fetchMessages();
    fetchTimeline();
  }, [fetchTicket, fetchMessages, fetchTimeline]);

  if (isLoadingTicket) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Ticket non trouvé</h1>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Retour au dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Bouton retour */}
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-ghost mb-6"
        >
          ← Retour au dashboard
        </button>

        {/* Détails du ticket */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <h1 className="card-title text-2xl">{ticket.title}</h1>
              <div className={getStatusBadgeClass(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Description :</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                <span>#{ticket.id}</span>
                {user?.role === 'MANAGER' && ticket.creatorName && (
                  <span className="ml-2">par {ticket.creatorName}</span>
                )}
              </div>
              <div className="text-right">
                <div>Créé le {new Date(ticket.createdAt).toLocaleString('fr-FR')}</div>
                <div>Modifié le {new Date(ticket.updatedAt).toLocaleString('fr-FR')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline des statuts */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            {isLoadingTimeline ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner"></span>
              </div>
            ) : timelineItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun historique disponible</p>
            ) : (
              <Timeline items={timelineItems} />
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Conversation</h2>
            
            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {isLoadingMessages ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner"></span>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun message pour le moment</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`chat ${message.authorId === user?.id ? 'chat-end' : 'chat-start'}`}>
                    <div className="chat-header">
                      {message.author?.name || 'Utilisateur inconnu'}
                      <time className="text-xs opacity-50">
                        {new Date(message.createdAt).toLocaleString('fr-FR')}
                      </time>
                    </div>
                    <div className={`chat-bubble ${message.authorId === user?.id ? 'chat-bubble-primary' : 'chat-bubble-base-200'}`}>
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Formulaire d'envoi de message */}
            {canSendMessages ? (
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="input input-bordered flex-1"
                  disabled={isSendingMessage}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!newMessage.trim() || isSendingMessage}
                >
                  {isSendingMessage ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Envoyer'
                  )}
                </button>
              </form>
            ) : (
              <div className="alert alert-info">
                <span>Ce ticket est fermé. Vous ne pouvez plus envoyer de messages.</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;
