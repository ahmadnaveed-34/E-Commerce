# E-Commerce App

## Overview

This E-Commerce App is a full-stack application with features including user authentication, shopping cart management, Stripe integration, and an admin panel for product management.

## Project Structure

The project is organized into client and server folders. The client-side handles the user interface, while the server-side manages backend logic and API endpoints.

## Setup

To run the project locally, follow these steps:

1. Clone the repository.
2. Navigate to the client and server folders.
3. Run `npm install` in both client and server folders to install dependencies.
4. Configure environment variables.
5. Run `npm start` to launch the application.

## Client

The client-side of the application is built using React. Key components include:

- User authentication forms (Login, Signup, Forget Password, Reset Password).
- Product Listing and Single Product details page
- Shopping cart functionality (Add, Delete, Increase quantity, Decrease quantity, Clear cart).
- Integration with Stripe built in hosting page for payment processing.
- State management using Redux Toolkit.
  - Products are fetched and displayed using Redux Toolkit.
  - Admin APIs are handled with async thunk middleware.
  - Cart functionality is also performed using redux toolkit but with local storage of browser.

## Server

The server-side is built with Node.js and Express. Key components include:

- Authentication endpoints (Login, Signup, Forget/Reset Password, Update user details, Update Password ).
- Controllers for Fetch products from Db and single product details
- Product management endpoints for Admin (Add, Delete, Update, View).
- User management endpoints for Admin (Add user, Delete user, Update user, Show users)
- Integration with Stripe for payment handling.
- Middlewares for handling JWT token authentication, Async Handler for asynchronous operations and to handle Error responses.

## Usage

- **User Authentication:** Users can sign up, log in, and recover/reset passwords.
- **Shopping Cart:** Users can add products to the cart, remove items, and adjust quantities.
- **Admin Panel:** Admins can manage products (Add, Delete, Update).
- **Payment:** Secure payment processing using Stripe.

## Contributing

If you'd like to contribute to the project, please follow these guidelines:

1. Report any issues through the GitHub issue tracker.
2. Submit pull requests with clear descriptions.

## License

This project is licensed under the [MIT License](LICENSE).
