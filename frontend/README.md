# UET MIT Instruments Checklist

This project is a full-stack CRUD web application designed to manage instruments for UET MIT. It features a cartoonized UI and allows users to add, view, and download a checklist of instruments along with a receipt.

## Frontend

The frontend is built using React and provides a user-friendly interface. It includes the following components:

- **Header**: Displays the title and navigation.
- **Instrument List**: Fetches and displays the list of instruments.
- **Instrument Form**: Allows users to add new instruments.
- **Receipt**: Generates and displays a receipt based on selected instruments and date.

### Getting Started

1. **Clone the repository**:

   ```
   git clone <repository-url>
   cd uet-mit-instruments-checklist/frontend
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

### Troubleshooting

If you encounter an OpenSSL error like `error:0308010C:digital envelope routines::unsupported`, it's because newer Node.js versions (17+) have updated their crypto policies. The package.json has been configured to handle this with the `--openssl-legacy-provider` flag.

## Backend

The backend is built using Node.js and Express. It handles CRUD operations for the instruments and connects to a database.

### Getting Started

1. **Navigate to the backend directory**:

   ```
   cd ../backend
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Run the server**:
   ```
   node server.js
   ```

The backend will be available at `http://localhost:5000`.

## Features

- Add new instruments to the checklist.
- View the list of instruments.
- Download a receipt with the instruments list and date.
- Cartoonized UI for a fun user experience.
- Node.js compatibility across versions.

## License

This project is licensed under the MIT License.
