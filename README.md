# UET MIT Instruments Checklist

## Overview

UET MIT Instruments Checklist is a full-stack CRUD web application designed to help users manage a checklist of instruments. The application features a cartoonized UI for an engaging user experience and allows users to download a receipt with the list of instruments and the date.

## Features

- **Create, Read, Update, Delete (CRUD)**: Manage instruments easily.
- **Cartoonized UI**: A fun and engaging interface.
- **Receipt Generation**: Download a receipt with the instruments list and date.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB (or any preferred database)
- **Styling**: CSS for custom styles

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB (or any preferred database) set up.

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd uet-mit-instruments-checklist
   ```

2. Navigate to the frontend directory and install dependencies:

   ```
   cd frontend
   npm install
   ```

3. Navigate to the backend directory and install dependencies:
   ```
   cd ../backend
   npm install
   ```

### Running the Application

1. Start the backend server:

   ```
   cd backend
   node server.js
   ```

2. In a new terminal, start the frontend application:
   ```
   cd frontend
   npm start
   ```

### Usage

- Access the application at `http://localhost:3000` for local development.
- For the deployed version, visit [our Vercel deployment](https://uet-mit-instruments-checklist-frontend.vercel.app).
- Use the interface to add, view, update, and delete instruments.
- Generate and download receipts as needed.

### Deployment

This project is deployed using Vercel:

- Frontend: [https://uet-mit-instruments-checklist-frontend.vercel.app](https://uet-mit-instruments-checklist-frontend.vercel.app)
- Backend API: [https://uet-mit-instruments-checklist-backend.vercel.app/api](https://uet-mit-instruments-checklist-backend.vercel.app/api)

To deploy your own version:

1. Fork this repository
2. Deploy the backend with `cd backend && vercel`
3. Deploy the frontend with `cd frontend && vercel`
4. Configure environment variables in the Vercel dashboard

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
