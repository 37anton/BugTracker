import React, { useEffect, useState, useCallback } from 'react';
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
  createdById: number;
  creatorName?: string;
}

export const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const { show } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    if (user) {
      show(`Bonjour ${user.name} ! 👋`, { variant: 'success' });
    }
  }, [user, show]);

  const fetchTickets = useCallback(async (page: number) => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`http://localhost:3000/tickets?page=${page}&limit=9`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.items || []);
        setTotalTickets(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / 9));
        setCurrentPage(page);
      } else {
        show('Erreur lors du chargement des tickets', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets:', error);
      show('Erreur de connexion', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [token, show]);

  // Charge les tickets de la page actuelle
  useEffect(() => {
    fetchTickets(currentPage);
  }, [fetchTickets, currentPage]);

  // Fonctions de navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
          <>
            {/* Informations de pagination */}
            <div className="text-center mb-6">
              <p className="text-gray-600">
                {totalTickets} tickets au total
              </p>
            </div>

            {/* Grille des tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            
            {/* Contrôles de pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                >
                  ← Précédent
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`btn btn-sm ${
                        pageNum === currentPage ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
