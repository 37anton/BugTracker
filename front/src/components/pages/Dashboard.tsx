import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/toast/ToastProvider';
import TicketCard from '../../components/TicketCard';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const { show } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      show(`Bonjour ${user.name} ! 👋`, { variant: 'success' });
    }
  }, [user, show]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const response = await fetch('http://localhost:3000/tickets', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data.items || []);
        } else {
          show('Erreur lors du chargement des tickets', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        show('Erreur de connexion', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [token, show]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">Aucun ticket trouvé</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
