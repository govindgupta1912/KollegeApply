# Admin Dashboard

A modern admin dashboard built with React.js, Tailwind CSS, and Redux Toolkit.

## Features

- User Authentication (Admin/User roles)
- News and Blog Management
- Advanced Filtering and Search
- Payout Calculator (Admin only)
- Export to CSV and PDF
- Responsive Design
- Dark Mode Support

## Tech Stack

- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Recharts
- React Datepicker
- jsPDF
- PapaParse
- React Toastify

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Login Credentials

- Admin User:
  - Email: admin@example.com
  - Password: admin123

- Regular User:
  - Email: user@example.com
  - Password: user123

### Features

1. **Dashboard**
   - Overview of articles and blogs
   - Statistics and charts
   - Recent articles list

2. **News & Blogs**
   - List of all articles
   - Filter by author, date, and type
   - Global search functionality

3. **Payout Management (Admin Only)**
   - Set payout rates for articles and blogs
   - View author-wise payout calculations
   - Export reports to CSV and PDF

## Development

### Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── redux/         # Redux store and slices
  ├── utils/         # Utility functions
  ├── App.jsx        # Main App component
  └── main.jsx       # Entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
