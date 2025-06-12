# Admin Dashboard

A modern, responsive admin dashboard built with React, Redux, and Tailwind CSS. This dashboard provides a comprehensive interface for managing news articles, blogs, and author payouts.

![Dashboard Overview]![Screenshot (613)](https://github.com/user-attachments/assets/144c3561-82aa-428f-9905-523f5964ef9e)
)
*Main dashboard view showing key metrics and statistics*

## Features

### 📊 Analytics Dashboard
- Real-time statistics and metrics
- Interactive charts and graphs
- Top authors by payout visualization
- News and blog article distribution

![Analytics Dashboard]![Screenshot (614)](https://github.com/user-attachments/assets/b80e9355-c4b1-4120-9968-d3295b5fa5d3)
)
*Analytics dashboard with interactive charts*

### 📰 News & Blog Management
- Comprehensive article listing
- Advanced search and filtering
- Date range selection
- Article categorization (News/Blog)
- Image preview and management

![News Management](![Screenshot (615)](https://github.com/user-attachments/assets/1777eb7f-8742-4a87-9f34-482600ea309f)
)
*News and blog management interface*

### 💰 Payout System
- Author payout tracking
- Customizable payout rates
- Export functionality (PDF/CSV)
- Detailed payout history

![Payout System](![Screenshot (618)](https://github.com/user-attachments/assets/46f563d6-a7ee-4fbb-8c56-80d1d31efcd0)
)
*Payout management system*

## Tech Stack

- **Frontend Framework:** React 19
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Date Handling:** React DatePicker
- **PDF Generation:** jsPDF
- **CSV Export:** PapaParse
- **UI Components:** Radix UI
- **Icons:** Heroicons & Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/admin-dashboard.git
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

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── redux/         # Redux store and slices
│   ├── services/      # API and utility services
│   ├── utils/         # Helper functions and constants
│   └── App.jsx        # Main application component
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Features in Detail

### Dashboard
- Real-time statistics display
- Interactive charts for data visualization
- Top authors list with payout information
- News and blog article distribution charts

### News & Blog Management
- Advanced search functionality
- Date range filtering
- Article categorization
- Image preview and management
- Responsive grid layout

### Payout System
- Author payout tracking
- Customizable payout rates
- Export functionality
- Detailed payout history
- PDF and CSV export options

## Deployment

The application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with default settings

The application will be automatically built and deployed.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Radix UI](https://www.radix-ui.com/)




