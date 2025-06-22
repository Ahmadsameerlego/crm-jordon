# Modern CRM Frontend

A modern, responsive Customer Relationship Management (CRM) frontend built with Vue 3, TypeScript, TailwindCSS, and the Composition API.

## 🌟 Features

### Global Features

- **Vue 3 + TypeScript + Composition API** - Modern Vue.js development
- **TailwindCSS** - Utility-first CSS framework for rapid UI development
- **Multilingual Support** - Arabic (default) and English with vue-i18n
- **Dark/Light Mode** - Responsive to system preferences with smooth transitions
- **Fully Responsive** - Works perfectly on all screen sizes
- **Modern Animations** - Smooth transitions and loading states

### Authentication

- **Login Page** - Clean, modern design with form validation
- **Authentication Guards** - Protected routes with automatic redirects
- **Session Management** - JWT token-based authentication

### Dashboard

- **Admin Dashboard** - Comprehensive overview with key metrics
- **Interactive Charts** - Revenue and conversion rate visualizations using Chart.js
- **Statistics Cards** - Real-time data display with animations
- **Recent Data Tables** - Latest clients and quotations

### Employee Management

- **CRUD Operations** - Create, Read, Update, Delete employees
- **Advanced Data Table** - Sorting, filtering, pagination
- **Export Functionality** - Export data to CSV/XLSX
- **Modal Forms** - Add/Edit employees with validation
- **Image Upload** - Profile picture support (ready for implementation)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crm
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

- **Email:** admin@example.com
- **Password:** password

## 📁 Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Reusable Vue components
├── composables/     # Vue 3 composables for reusable logic
├── locales/         # i18n translation files
├── plugins/         # Vue plugins (i18n, etc.)
├── router/          # Vue Router configuration
├── stores/          # Pinia stores for state management
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── views/           # Page components
```

## 🛠️ Built With

- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vue Router](https://router.vuejs.org/)** - Official router for Vue.js
- **[Pinia](https://pinia.vuejs.org/)** - Intuitive, type safe store for Vue
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Internationalization plugin
- **[Chart.js](https://www.chartjs.org/)** - Simple yet flexible JavaScript charting
- **[PrimeVue](https://primevue.org/)** - Rich UI component library
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling

## 🎨 Design Features

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid system

### Dark Mode

- System preference detection
- Manual toggle option
- Smooth transitions between themes
- Consistent color scheme

### Animations

- Page transitions
- Loading states
- Hover effects
- Modal animations

## 🌐 Internationalization

The application supports both Arabic and English:

- **Default Language:** Arabic
- **Fallback Language:** English
- **RTL Support:** Full right-to-left layout support for Arabic

### Adding New Languages

1. Create a new locale file in `src/locales/`
2. Add the language to the i18n configuration
3. Update the language switcher component

## 📊 Data Management

### State Management

- **Pinia Stores:**
  - `auth` - Authentication and user management
  - `employees` - Employee CRUD operations
  - `dashboard` - Dashboard statistics and data

### Mock Data

The application includes comprehensive mock data for demonstration:

- 3 sample employees
- Dashboard statistics
- Recent clients and quotations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=CRM System
```

### TailwindCSS Configuration

Custom configuration in `tailwind.config.js`:

- Custom color palette
- Animation definitions
- Dark mode support
- Form and typography plugins

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit
```

### E2E Tests

```bash
npm run test:e2e
```

## 📈 Future Enhancements

### Planned Features

- [ ] Client management module
- [ ] Quotation management
- [ ] Deal tracking
- [ ] Advanced reporting
- [ ] Real-time notifications
- [ ] File upload system
- [ ] Advanced search and filters
- [ ] User roles and permissions
- [ ] Audit logging
- [ ] API integration

### Technical Improvements

- [ ] PWA support
- [ ] Offline functionality
- [ ] Performance optimizations
- [ ] Advanced caching strategies
- [ ] Micro-frontend architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- TailwindCSS for the utility-first CSS approach
- PrimeVue for the rich component library
- Chart.js for the beautiful charts
- All contributors and maintainers

---

**Built with ❤️ using Vue 3 and modern web technologies**
