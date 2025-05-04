# Cab Connect

A modern, accessible, and feature-rich ride booking platform for riders, built with React and TypeScript. This project provides a seamless experience for booking rides, managing profiles, viewing ride history, handling payments, and more.

## Features

### 1. Book a Ride
- **Location Selection:** Enter pickup and drop-off locations with map preview.
- **Accessibility Options:** Request wheelchair access, visual/hearing assistance, mobility aid, and provide special instructions.
- **Vehicle Selection:** Choose from multiple vehicle types (Auto, Mini, Sedan, SUV, Wheelchair Accessible) with real-time availability.
- **Schedule Rides:** Book instantly or schedule for a later date/time.
- **Share Ride:** Find and confirm co-passengers for shared rides, with gender-matching and in-app chat.
- **Dynamic Pricing:** Real-time fare calculation, coupon application, and ride insurance option.
- **Favorite Drivers:** Book rides with your favorite drivers directly.
- **Backup Drivers:** For scheduled rides, backup drivers are automatically assigned.
- **Emergency SOS:** Quick access to emergency services during a ride.

### 2. Ride History
- View all past rides with details: date, time, locations, fare, and driver info.
- Rate drivers and view previous ratings.

### 3. Profile Management
- View and edit personal details (name, email, phone, gender, address, emergency contact).
- Membership management: subscribe, upgrade, and view benefits.
- View ride statistics and membership status.

### 4. Payments
- Multiple payment methods: Credit/Debit Card, UPI, Cash, Wallet.
- View transaction history and download receipts.
- Manage and set default payment options.

## Panels

### Rider Panel
- **Book a Ride:** Schedule rides, share rides, and manage accessibility options.
- **Ride History:** View past rides and rate drivers.
- **Profile Management:** Update personal details and manage membership.
- **Payments:** Handle transactions and manage payment methods.

### Driver Panel
- **Ride Requests:** Accept or decline ride requests.
- **Earnings:** View earnings and transaction history.
- **Profile Management:** Update driver details and vehicle information.

### Admin Panel
- **Driver Management:** Manage driver profiles and vehicle details.
- **Analytics Dashboard:** View system statistics and performance metrics.
- **Support Queries:** Handle customer and driver support requests.

## Tech Stack
- **Frontend:** React, TypeScript
- **UI:** Tailwind CSS, Lucide Icons
- **State Management:** React Hooks
- **Other:** Mock data for drivers, rides, and payments

## Getting Started

### Prerequisites
- Node.js (v16 or above)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```
4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Usage
- Use the navigation tabs to switch between booking, history, profile, and payment panels.
- Book rides, apply coupons, select insurance, and manage your profile.
- For admin access, use the credentials:
  - **Email:** admin@smartcab.com
  - **Password:** admin123

## Folder Structure
```
src/
  components/      # React components (RideBooking, RideHistory, PaymentPage, etc.)
  utils/           # Utility functions (pricing, helpers)
  types/           # TypeScript type definitions
  App.tsx          # Main app entry
  index.tsx        # React entry point
```

## Accessibility & UX
- Fully responsive and mobile-friendly
- Keyboard navigable and screen reader friendly
- Clear error messages and loading states
- Accessible color contrast and focus indicators

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Acknowledgements
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Cab Connect** — Making urban mobility smarter, safer, and more inclusive. 