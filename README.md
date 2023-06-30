
# Odinbook Backend App
Odinbook is a social media platform backend application that provides the necessary server-side functionality to handle user authentication, manage posts, handle friend requests, and more.

### Features
* User registration and login with JWT authentication
* Friend request management
* Post creation, update, and deletion
* Like and unlike posts
* Commenting on posts
* User profile management
### Technologies Used
* Node.js
* Express.js
* MongoDB (or any other database)
* Passport.js for authentication
* JSON Web Tokens (JWT) for authentication
* Multer for handling file uploads
* Mongoose (or any other ODM/ORM) for database interaction
### Getting Started
To get started with the Odinbook backend app, follow these steps:

* Clone the repository: git clone https://github.com/your/repository.git
* Install the dependencies: npm install
* Configure the environment variables:
* Create a .env file based on the provided .env.example file
* Set the required environment variables such as database connection URI, JWT secret, etc.
* Start the server: npm start
* The server should now be running at http://localhost:3000
## API Endpoints
### Authentication
* POST /sign-up: Register a new user
* POST /login: Log in with existing credentials
### User
* POST /test-user: Create a test user (for development/testing purposes)
* GET /users: Get a list of all users
### Friend Request
* POST /send-request: Send a friend request (requires authentication)
* POST /decline-request: Decline a friend request (requires authentication)
* POST /accept-request: Accept a friend request (requires authentication)
* GET /request-list/:userId: Get a list of friend requests for a user (requires authentication)
### Post
* GET /posts: Get a list of all posts (requires authentication)
* POST /posts: Create a new post (requires authentication)
* PUT /posts/:postId: Update an existing post (requires authentication)
* DELETE /posts/:postId: Delete a post
### Like/Unlike Post
* POST /posts/:postId/like: Like or unlike a post (requires authentication)
### Comment
* POST /posts/:postId/comment: Create a comment on a post (requires authentication)
### User Profile
* GET /profile/:userId: Get a user's profile information
* PUT /profile/:userId/update: Update a user's profile (requires authentication)
Refer to the API documentation or code comments for more details on the request/response formats and required authentication.
