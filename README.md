# PassEvent – MVP Backend

## 📌 Description
**PassEvent** est une application de gestion d’événements permettant :
- de créer et gérer des événements,
- de définir des sessions et des types de billets,
- de simuler un processus d’achat de billets (checkout),
- de générer des tickets avec QR token,
- de gérer le **check-in** (scan) des participants le jour de l’événement.

Ce projet correspond à un **MVP backend** réalisé dans le cadre du cours de **Software Engineering**, en suivant une démarche incrémentale et test-driven.

---

## 🛠️ Stack technique
- **Node.js**
- **Express.js**
- **Vitest** (tests unitaires)
- **Supertest** (tests HTTP)
- Stockage **en mémoire** (fake DB) via un `store.js`

---

## 🚀 Installation et lancement

### 1️⃣ Installer les dépendances
```bash
npm install

 http://localhost:3000/api/events

 http://localhost:3000/api/events/E1

 http://localhost:3000/api/events/E1/sessions
 
  http://localhost:3000/api/events/E1/ticket-types