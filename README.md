# Charity Donation Platform

A web-based platform that connects donors with verified charities, facilitating secure donations and transparent impact reporting.

## Features

### For Donors

- User registration and authentication
- Browse and search verified charities
- Make secure donations using Razorpay
- Download donation receipts
- View donation history
- Receive email notifications and updates

### For Charities

- Charity registration with verification process
- Charity dashboard to manage profile
- Post impact reports and updates
- Track donations and donor statistics
- Email communication with donors

### For Administrators

- Admin dashboard to manage charities
- Verify and approve charity registrations
- Monitor platform activities
- Access detailed statistics

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Payment Gateway**: Razorpay
- **Email Service**: MailerSend
- **Frontend**: HTML, CSS (Bootstrap 5), JavaScript
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/charity-donation-platform.git
cd charity-donation-platform
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DB_NAME=charity-donation
DB_HOST=localhost
DB_PASSWORD=your_password
DB_USER=your_username
JWT_SECRET=your_jwt_secret
ADMIN_CODE=your_admin_code
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
MAILERSEND_API_KEY=your_mailersend_key
```

4. Initialize the database:

```bash
npm run seed
```

5. Start the server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/charity/login` - Charity login

### Charities

- `POST /api/charities/register` - Register new charity
- `GET /api/charities` - List all charities
- `GET /api/charities/:id` - Get charity details
- `PUT /api/charities/:id` - Update charity profile
- `PUT /api/charities/:id/status` - Update charity status (admin only)

### Donations

- `POST /api/donations/create-order` - Create donation order
- `POST /api/donations/verify` - Verify donation payment
- `GET /api/donations/history` - Get user's donation history
- `GET /api/donations/receipt/:id` - Download donation receipt

### Impact Reports

- `POST /api/impact-reports` - Create impact report
- `GET /api/impact-reports/charity/:id` - Get charity's impact reports

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Razorpay for payment processing
- MailerSend for email services
- Bootstrap for UI components
