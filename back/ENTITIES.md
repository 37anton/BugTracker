# Entités du Bug Tracker

## Enums

### UserRole
```typescript
enum UserRole {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
}
```

### TicketStatus
```typescript
enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}
```

## Entités

### User
Représente un utilisateur du système.

**Champs :**
- `id` : Identifiant unique (auto-généré)
- `email` : Email unique de l'utilisateur
- `password` : Mot de passe hashé
- `name` : Nom complet de l'utilisateur
- `role` : Rôle de l'utilisateur (CLIENT ou MANAGER)
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

**Relations :**
- `createdTickets` : Tickets créés par cet utilisateur

### Ticket
Représente un ticket de bug ou demande.

**Champs :**
- `id` : Identifiant unique (auto-généré)
- `title` : Titre du ticket
- `description` : Description détaillée
- `status` : Statut actuel du ticket
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification
- `createdById` : ID de l'utilisateur qui a créé le ticket

**Relations :**
- `createdBy` : Utilisateur qui a créé le ticket
- `history` : Historique des changements de statut

### TicketHistory
Représente l'historique des changements de statut d'un ticket.

**Champs :**
- `id` : Identifiant unique (auto-généré)
- `previousStatus` : Statut précédent
- `newStatus` : Nouveau statut
- `changedAt` : Date du changement
- `changedById` : ID de l'utilisateur qui a fait le changement

**Relations :**
- `ticket` : Ticket concerné
- `changedBy` : Utilisateur qui a fait le changement

## Logique métier

### Rôles et permissions
- **CLIENT** : Peut créer des tickets et voir ses propres tickets
- **MANAGER** : Peut voir tous les tickets et changer leur statut

### Workflow des tickets
1. Un CLIENT crée un ticket avec le statut `OPEN`
2. Un MANAGER peut changer le statut vers `IN_PROGRESS` ou `CLOSED`
3. Chaque changement de statut est enregistré dans `TicketHistory`

### Historique des statuts
Chaque fois qu'un MANAGER change le statut d'un ticket :
1. Le statut actuel devient `previousStatus`
2. Le nouveau statut devient `newStatus`
3. L'utilisateur qui fait le changement est enregistré
4. La date du changement est automatiquement enregistrée
