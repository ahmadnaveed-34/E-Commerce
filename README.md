# E-Commerce App

## Overview

This E-Commerce application is a full-stack project featuring secure user authentication with JWT, product browsing, cart and wishlist management, address handling, and Stripe-powered payment integration.
An advanced admin panel allows administrators to manage products, orders, users, categories, subcategories, banners, blogs, logos, and promotional slides.
Built with React (using Context API for state management) and Node.js/Express for the backend, the application delivers a fast, secure, and scalable experience for both users and administrators.

## Project Structure

The project is organized into client, admin and server folders. The client-side handles the user interface, admin side handles the products, orders, users etc, while the server-side manages backend logic and API endpoints.

## Setup

To run the project locally, follow these steps:

1. Clone the repository.
2. Navigate to the client, admin and server folders.
3. Run `npm install` in client, admin and server folders to install dependencies.
4. Configure environment variables.
5. Run `npm start` to launch the application, but for admin run `npm run dev` to launch appliaction.

## Client

The client-side of the application is built using React.js with a strong focus on performance, security, and smooth user experience. Key components include:

Secure User Authentication:

- Login and Signup functionality
- Secure authentication using JWT tokens
- Password Reset with secure token validation
- Email Verification after signup
- Protected routes accessible only to authenticated users

User Account Management:

- Update profile details (name, email, password, etc.)
- Address Management (Add, Edit, Delete shipping addresses)
- Wishlist Management (Add, View, Remove Wishlist items)
- View order history and order tracking

Product and Cart Features:

- Full Product Listing and Single Product Details page
- Add products to the Cart
- Manage cart items (Increase/Decrease quantity, Remove item, Clear cart)

Wishlist Functionality:

- Add products to Wishlist for future purchases
- Manage Wishlist easily from product pages

Secure Payment Integration:

- Integration with Stripe's hosted checkout page
- Payment processing is fully secured
- Orders are created only after successful payment confirmation

Content and Display:

- View dynamic Home Page Banners, Promotional Slides, and Popular/Featured Products managed by Admin.
- Read Blogs posted and updated by Admin.

State Management:

- React Context API is used for state management across the application
- User authentication state, Cart data, Wishlist, and Order Tracking are managed globally using Context
- Cart data is persisted using Local Storage for better user experience even after browser refresh

Performance Enhancements:

- Lightweight, optimized codebase using Vite build tools
- Fully responsive and mobile-friendly design

## Server

The server-side is built using Node.js and Express.js, providing a robust and scalable backend structure. Key functionalities include:

Authentication System:

- User Signup and Login
- Forgot/Reset Password functionality
- Update user profile and password
- Product Management:
- Fetch all products from the database
- Fetch single product details
- Home page slides, banners, featured and popular product listings

User Features:

- Add to Cart and Wishlist functionality
- Address management for shipping details
- Order tracking and history
- Content Management:
- Category and Subcategory management
- Blog management system
- Logo and branding management

Payment Integration:

- Secure payment handling via Stripe API
- Backend Middlewares:
- JWT Authentication middleware
- Async Handler for asynchronous operations
- Centralized Error Handling middleware

## Admin

The admin-side of the application is built using Vite with a fast and optimized setup for high performance. Key components include:

Dashboard Overview:

- View total products, orders, users, categories, and earnings summary
- Recent activity and quick stats

Product Management:

- Add, Update, Delete, and View products
- Manage product images, prices, stock, and status.

Order Management:

- View all customer orders
- Update order status (Processing, Shipped, Delivered, Cancelled)
- Track payment and delivery information

User Management:

- Add, Update, Delete, and View users
- Manage user roles (Admin/User)
- Reset user passwords

Category & Subcategory Management:

- Add, Update, Delete categories and subcategories
- Organize products under respective categories for better browsing

Banner, Slide, and Logo Management:

- Add and manage homepage banners and promotional slides
- Update and manage site logo for branding

Blog Management:

- Add, Update, Delete blog posts
- Manage blog categories and featured blogs for better engagement

Content & Settings Control:

- Full control over website content through a clean admin interface
- Manage address information, site settings, and marketing sections

## Usage

User Authentication:

- Users can securely sign up, log in, verify their email, and recover or reset their passwords using token-based authentication (JWT). Protected routes ensure only authorized users access their accounts.

Shopping Cart & Wishlist:

- Users can browse products, add items to their cart or wishlist, update quantities, remove items, and manage their selections seamlessly. Cart state is maintained even after browser refresh using local storage.

Profile & Address Management:

- Users can update their personal information, manage multiple shipping addresses, and track their order history directly from their dashboard.

Admin Panel:

- Administrators have full control to manage products (Add, Update, Delete), view and manage orders, oversee user accounts, manage categories and subcategories, publish blogs, update homepage banners, slides, and the site logo through a dedicated admin interface.

Payment:

- Secure and reliable payment processing is integrated through Stripe’s hosted checkout, ensuring safe online transactions. Orders are confirmed only after successful payment.

Dynamic Content Management:

- Users can view promotional banners, featured products, and read blog posts dynamically created and managed by the admin.

## Contributing

If you'd like to contribute to the project, please follow these guidelines:

1. Report any issues through the GitHub issue tracker.
2. Submit pull requests with clear descriptions.

## License

This project is licensed under the [MIT License](LICENSE).
