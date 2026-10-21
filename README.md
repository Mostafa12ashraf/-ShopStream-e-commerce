# ShopStream E-Commerce

An educational React e-commerce frontend built with React, Vite, React Bootstrap, Redux Toolkit, React Router, Axios, and the DummyJSON mock API.

The application features a responsive customer Storefront, user authentication with session persistence, a customer cart with multi-step checkout, a user profile displaying the latest local order, and a protected Admin Dashboard for managing products, users, and carts.

---

## Project Overview

ShopStream was developed as an educational frontend application designed to demonstrate and practice modern frontend development principles:

- Modular React component architecture and clear separation of concerns.
- Predictable State management across local component state, React Context, and Redux Toolkit.
- Direct REST API communication using Axios inside owning components.
- Secure client-side authentication flows with configurable storage persistence.
- Controlled forms with robust client-side validation.
- Complete CRUD interfaces with presentational modal components.
- Responsive layout and UI styling with React Bootstrap and custom CSS variables.
- Coordinated Light and Dark themes across both Storefront and Dashboard layouts.
- Transparent handling and documentation of mock API capabilities and constraints.

DummyJSON is utilized as an educational mock REST service. All remote write operations (create, update, delete) are simulated by the mock server and do not permanently persist in a real remote database.

---

## Core Features

### Storefront

- **Home Page**: Featured banners, promotional highlights, and direct entry points to shopping categories.
- **Product Catalog**: Paginated grid displaying product cards with titles, thumbnails, brands, dynamic star ratings, price tags, and discount badges.
- **Product Details**: Multi-image interactive gallery, real-time stock availability check, quantity selector, tabbed specifications, customer reviews, and related product recommendations.
- **Product Search**: Real-time keyword filtering synchronized with URL parameters.
- **Category Browsing**: Dynamic category listing and filtering fetched from DummyJSON.
- **Multi-Faceted Filtering**: Price range sliders, minimum rating filters, and brand-specific checkboxes.
- **Sorting Options**: Sort products by price (low to high, high to low), customer rating, and alphabetical title.
- **Pagination**: Server-aligned pagination controls with active page indicators.
- **Feedback States**: Dedicated loading spinners, error alerts with retry options, and clear empty states for queries yielding no results.
- **Layout**: Unified `StoreNavbar` with quick-search, dynamic cart item badge, authentication controls, and a structured `StoreFooter`.

### Customer Cart

- **Item Management**: Add products to cart from catalog cards or product detail pages.
- **Quantity Controls**: Increment and decrement item quantities with stock-aware boundary constraints (cannot exceed available inventory).
- **Item Removal**: Immediate removal of line items from the active cart.
- **Redux Toolkit State**: Dedicated slice (`cartSlice`) managing cart state and actions.
- **Local Persistence**: Automatic synchronization with browser `localStorage` ensuring cart items persist across page refreshes.
- **Order Summary**: Real-time calculation of subtotal, estimated shipping, estimated tax, and grand total.
- **Empty Cart State**: Visual empty state with direct call-to-action to return to the product catalog.

### Checkout and Orders

- **Shipping Form**: Controlled form capturing recipient full name, email, street address, city, state, postal code, and country.
- **Validation**: Strict validation rules for required fields, email formatting, and postal codes before submission.
- **Payment Method Selection**: UI switcher for credit card, PayPal, or cash on delivery.
- **Simulated Payment**: Safe demonstration flow with no storage of sensitive payment card information.
- **Order Snapshot**: Generates an order record (`lastOrder`) stored in `localStorage` containing items, shipping details, timestamp, and order totals.
- **Cart Reset**: Automatic clearing of the Redux cart immediately upon successful order placement.
- **Navigation Guard**: Smooth programmatic transition using history replacement directly to the order confirmation page, preventing accidental cart redirects.
- **Order Confirmation**: Displays a detailed purchase summary, unique order ID, itemized receipt, and static order progress visualization.
- **Post-Order Actions**: Direct links to Continue Shopping or View Order History via the user profile.

### Authentication and Profile

- **DummyJSON Login**: Direct integration with `https://dummyjson.com/auth/login`.
- **Remember Me Toggle**: Allows users to choose between 30-day persistent storage (`localStorage`) and single-session storage (`sessionStorage`).
- **Storage Isolation**: Strict clearing of legacy credentials ensuring `localStorage` and `sessionStorage` never hold competing active sessions.
- **Mock Registration**: Client-side registration simulation allowing immediate exploration without requiring a remote database account.
- **Session Management**: Shared `AuthContext` providing user data, authentication token, login, logout, and profile update handlers.
- **Protected Routes**: Navigation guards restricting access to `/profile` and `/dashboard` to authenticated users.
- **User Profile**: Displays user avatar, credentials, personal information, and contact details.
- **Edit Profile**: Direct PUT request simulation updating the active user session in memory and active browser storage.
- **Latest Local Order**: Profile section rendering the most recently completed local checkout order with full light and dark mode styling.

### Admin Dashboard

- **Dashboard Layout**: Dedicated layout featuring a desktop sidebar and a responsive mobile offcanvas drawer.
- **Overview Page**: High-level system cards and quick links to admin modules.
- **Products Management (`ProductsAdmin`)**:
  - Tabular listing with server-aligned pagination (`PAGE_SIZE = 4`).
  - Search filtering by product title.
  - Add and Edit product workflows using unified modal forms with input validation.
  - Delete product confirmation modal with loading indicators.
  - Current-page CSV export.
- **Users Management (`UsersAdmin`)**:
  - User catalog with pagination and search.
  - Customer vs. Moderator badge distinction.
  - View user details modal.
  - Add and Edit user modals with client-side validation.
  - Delete user confirmation modal.
  - Current-page CSV export.
- **Carts Management (`CartsAdmin`)**:
  - Overview of simulated customer carts.
  - Filter carts by specific user ID.
  - Dynamic product row addition and deletion in cart creation/editing modals.
  - Itemized cart details inspection modal.
  - Delete cart confirmation modal.
  - Current-page CSV export.
- **Shared Admin Components**: Standardized pagination controls (`DashboardPagination`) and honest mock notices (`MockApiNotice`) kept in a flat directory under `src/components/dashboard/`.

---

## Optional Project Enhancements

The following additions were implemented beyond the baseline requirements to enhance project usability and presentation:

- **Persistent Global Dark Mode**: Complete dual-theme system toggling between light and dark modes across Storefront and Dashboard, persisting user preference via `localStorage` and setting both `data-theme` and `data-bs-theme` on the root HTML element.
- **Advanced Product Filtering**: Multi-condition filtering combining categories, price range, customer ratings, and brands simultaneously.
- **CSV Data Exports**: On-demand CSV generation and download for current-page tables across Products, Users, and Carts admin modules.
- **Dashboard Metric Cards**: Summary statistics computed from current-page datasets to provide immediate visual context.
- **Edit Profile Integration**: Live profile editing with immediate local storage reflection.
- **Latest Local Order Display**: Localized order persistence linking checkout activity directly to the customer profile.
- **Rich Empty and Error States**: Contextual visual feedback when searches return empty or network requests fail.
- **Recent Cart Activity and Alerts**: Contextual summary panels and dismissible alert widgets in the Carts admin area.
- **Demo Support Feedback**: Interactive modals on customer-facing pages offering transparent feedback that customer support is simulated.
- **Entity-Specific Modals**: Refactored presentational modal components for form creation, item inspection, and delete confirmation per entity.
- **Mock API Notices**: Informational callouts explaining that write actions are simulated.

> These are project enhancements and are not required for the core application flow.

---

## Technology Stack

The project relies strictly on the following libraries and tools as defined in `package.json`:

- **React 19** (`react` ^19.2.8, `react-dom` ^19.2.8): Core library for declarative user interfaces using functional components and hooks.
- **Vite 8** (`vite` ^8.3.0): Build tool and development server providing fast Hot Module Replacement (HMR).
- **JavaScript & JSX**: ESModule-based application source code.
- **React Router 7** (`react-router-dom` ^7.18.4): Client-side routing, nested layouts, and route protection.
- **React Bootstrap 2** (`react-bootstrap` ^2.10.10) & **Bootstrap 5** (`bootstrap` ^5.3.8): Component library and grid system for responsive layouts and modal dialogs.
- **Redux Toolkit** (`@reduxjs/toolkit` ^2.13.0) & **React Redux** (`react-redux` ^9.3.0): Predictable state container utilized specifically for customer cart management.
- **Axios** (`axios` ^1.20.0): HTTP client used directly inside owning parent pages for REST API communication.
- **DummyJSON Mock API**: Free external mock REST service providing product catalogs, authentication, users, and carts.
- **Vanilla CSS & CSS Variables**: Global styles and scoped stylesheets leveraging custom properties for unified theme handling.
- **Oxlint** (`oxlint` ^1.81.0): High-performance linter ensuring code quality and standards compliance.

---

## State Management

State responsibilities are strictly separated to maintain clarity and avoid unnecessary coupling:

### Redux Toolkit

Redux Toolkit is reserved exclusively for the customer shopping cart:

- Line items and product metadata (ID, title, price, thumbnail, stock).
- Quantity adjustments and boundaries.
- Adding, updating, and removing items.
- Full cart clearing after order placement.
- Automatic synchronization with browser `localStorage` under the `cartItems` key.

### AuthContext

React Context handles user identity and authentication lifecycle:

- Current user profile object and JWT authentication token.
- Active login and logout handlers.
- Storage routing: saves credentials to `localStorage` when Remember Me is enabled, or to `sessionStorage` when disabled.
- Updating local user profile data upon edit operations.

### ThemeContext

React Context coordinates global theme state:

- Tracks active theme (`light` or `dark`).
- Reads and updates the `shopstreamTheme` key in `localStorage`.
- Sets `data-theme` and `data-bs-theme` attributes on `document.documentElement`.
- Exposes a toggle function consumed by Storefront and Dashboard theme switchers.

### Local Component State

Standard React hooks (`useState`, `useEffect`) manage localized component logic:

- Controlled form inputs and validation errors.
- Keyword search terms, filter values, and sorting selections.
- Pagination indices (`currentPage`, `limit`, `skip`).
- Loading, error, and empty feedback flags.
- Modal open/close visibility states.
- Local list state updates following simulated CRUD operations in parent admin pages.

---

## Application Routes

All routes are defined in `src/App.jsx` using React Router:

| Route | Layout | Protection | Description |
| :--- | :--- | :--- | :--- |
| `/` | StoreLayout | Public | Storefront home page with hero banners and categories |
| `/products` | StoreLayout | Public | Product catalog with live search, filters, and pagination |
| `/products/:id` | StoreLayout | Public | Detailed product view with gallery, specs, and reviews |
| `/cart` | StoreLayout | Public | Customer shopping cart with item quantity controls |
| `/checkout` | StoreLayout | Public / Guarded | Multi-step checkout form (requires active cart items) |
| `/order-confirmation` | StoreLayout | Public / Guarded | Order receipt and static tracking (requires `lastOrder`) |
| `/login` | StoreLayout | Public | Authentication page with demo autofill helper |
| `/register` | StoreLayout | Public | Mock user registration page |
| `/profile` | StoreLayout | Protected | Authenticated user profile and latest local order |
| `/dashboard` | DashboardLayout | Protected | Admin overview with system navigation and summary |
| `/dashboard/products` | DashboardLayout | Protected | Products admin inventory with search, pagination, and CRUD |
| `/dashboard/users` | DashboardLayout | Protected | Customers admin directory with details and modal management |
| `/dashboard/carts` | DashboardLayout | Protected | Carts admin overview with line-item inspection and creation |
| `*` | None | Public | Fallback 404 page for undefined routes |

---

## Project Structure

The project follows a modular, feature-oriented structure:

```text
src/
├── components/
│   ├── dashboard/
│   ├── layout/
│   └── store/
├── context/
├── layouts/
├── pages/
│   ├── auth/
│   ├── dashboard/
│   └── store/
├── redux/
├── App.jsx
├── index.css
└── main.jsx
```

### Directory Responsibilities

- **`src/components/dashboard/`**: Presentational and reusable admin modal components kept in a flat directory (`ProductFormModal`, `DeleteProductModal`, `UserFormModal`, `UserDetailsModal`, `DeleteUserModal`, `CartFormModal`, `CartDetailsModal`, `DeleteCartModal`, `DashboardPagination`, `MockApiNotice`).
- **`src/components/layout/`**: Core storefront navigation elements including `StoreNavbar` and `StoreFooter`.
- **`src/components/store/`**: Customer-facing storefront components including `ProductCard`, `ProductsFilters`, `ProductsPagination`, and `CartItem`.
- **`src/context/`**: React Context providers managing shared cross-cutting concerns (`AuthContext.jsx` and `ThemeContext.jsx`).
- **`src/layouts/`**: Page wrapper components providing persistent headers and sidebars (`StoreLayout.jsx` and `DashboardLayout.jsx`).
- **`src/pages/auth/`**: Authentication pages (`Login.jsx`, `Register.jsx`, and `Auth.css`).
- **`src/pages/dashboard/`**: Parent admin views responsible for state ownership and API requests (`Overview.jsx`, `ProductsAdmin.jsx`, `UsersAdmin.jsx`, `CartsAdmin.jsx`, and `Dashboard.css`).
- **`src/pages/store/`**: Feature-specific storefront views with dedicated styling folders (`Home`, `Products`, `ProductDetails`, `Cart`, `Checkout`, `OrderConfirmation`, `Profile`).
- **`src/redux/`**: Redux store configuration (`store.js`) and customer cart slice (`cartSlice.js`).

---

## Installation and Local Development

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (version 9 or higher recommended)

### Setup Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce-frontend
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Vite will display the local development URL in the terminal (typically `http://localhost:5174/` or `http://localhost:5173/`).

### Available Scripts

- **`npm run dev`**: Starts the Vite development server with Hot Module Replacement.
- **`npm run build`**: Compiles and bundles the application for production inside the `dist` directory.
- **`npm run lint`**: Runs Oxlint across the project to verify syntax and code quality rules.
- **`npm run preview`**: Boots a local static web server to preview the production build output.

---

## Demo Credentials

To test authenticated features, use the provided demo account supported by the DummyJSON authentication endpoint:

- **Username**: `emilys`
- **Password**: `emilyspass`

An **Autofill** button is provided on the Login page (`/login`) to populate these credentials with a single click.

> Authentication requests require internet access to communicate with the public DummyJSON API service.

---

## API and Local Persistence

The application coordinates data between an external mock REST service and browser storage:

### DummyJSON REST API

The application connects to `https://dummyjson.com` for:

- Product catalogs, search queries, category lists, and individual product details.
- User authentication via the `/auth/login` endpoint.
- User directory queries and simulated user mutations.
- Cart resources, user-specific cart queries, and simulated cart CRUD operations.
- Simulated profile updates via direct PUT requests.

### Browser Storage

Browser storage is utilized for client-side state preservation:

- **`cartItems`** (`localStorage`): Persists customer shopping cart items and quantities across browser sessions.
- **`shopstreamTheme`** (`localStorage`): Stores user theme selection (`light` or `dark`).
- **`lastOrder`** (`localStorage`): Stores the latest checkout order snapshot for display on the order confirmation and profile pages.
- **`token` & `user`**: Stored in `localStorage` when Remember Me is enabled, or in `sessionStorage` when disabled.

---

## Mock API Limitations

Because this frontend interacts with DummyJSON rather than a custom persistent backend, the following constraints apply:

- **Simulated Mutations**: Create, Update, and Delete requests return mock success responses from DummyJSON but are not permanently written to the remote database. Modified records reset upon page reload or re-fetching from the server.
- **Mock Registration**: Registration is simulated entirely on the client side. New accounts cannot be authenticated by DummyJSON's remote server.
- **Local Order History**: Because DummyJSON does not store user checkouts, the Latest Local Order view displays orders saved locally on the client machine.
- **Demo Support**: The customer support action opens an informational modal explaining that live ticketing is not connected to a backend service.
- **Static Order Tracking**: The order status bar on the confirmation page is an educational visual display, not an active carrier tracking integration.
- **Dashboard Security**: Dashboard route protection verifies the presence of an authentication token on the client; it does not implement role-based access control (RBAC).
- **Current-Page CSV Export**: CSV generation processes only the records present on the currently loaded pagination page.
- **Current-Page Metrics**: Dashboard metric cards calculate statistics based on the active page data rather than the full remote dataset.
- **Simulated Payment**: The checkout payment interface simulates payment method selection; no real transactions occur, and no financial data is collected or stored.

---

## Testing and Quality Checks

The project has passed comprehensive quality verification:

- **Manual Testing**: User-accepted validation covering checkout placement, cart clearing, navigation guards, profile dark mode styling, demo support interactions, delete modal props, and cart details error resets.
- **Code Linting**: Oxlint execution completed with **0 errors and 0 warnings** across all 39 JavaScript and JSX source files.
- **Production Build**: Vite production build completed successfully with clean bundle generation.
- **Import Verification**: All internal import paths and component exports were validated following file reorganization.

> Note: The project does not currently include an automated End-to-End test suite (such as Cypress or Playwright).

---

## Live Demo

The deployment link will be added after the Vercel deployment step.

---

## Course Context

This project was built as part of the frontend web development curriculum to demonstrate practical mastery of:

- React component architecture and props contracts.
- Client-side routing with nested layouts and route protection.
- State management paradigms (Redux Toolkit vs. React Context vs. Local State).
- Asynchronous API communication and error handling.
- Controlled forms with real-time validation.
- Responsive design using Bootstrap utilities and custom CSS.
- Transparent handling of external mock services.

---

## Future Improvements

Potential future enhancements that could be explored beyond course submission include:

- Integration with a dedicated persistent backend and database (e.g., Node.js and PostgreSQL/MongoDB).
- Persistent user registration and server-side profile management.
- Backend role-based authorization for administrative privileges.
- Remote order history tracking and customer invoice generation.
- Integration with an actual payment gateway (such as Stripe).
- Implementation of automated End-to-End testing suites.
- Image optimization, responsive source sets, and CDN caching.
