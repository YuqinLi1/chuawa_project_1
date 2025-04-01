How data is Stored in MongoDB

1.Environment and Prerequisites

2.  Install Dependencies

        "bcrypt": "^5.1.1",
        "cors": "^2.8.5",
        "express": "^4.21.2",
        "jsonwebtoken": "^9.0.2",
        "mongoose": "^8.13.1"

3.In backend File, .env shows the MongoDB connection, userName: training, password: shangan
APP_MONGODB_URL: pointers to MongoDB server

4.Connecting to the Database and Starting the Backend
(1) In config folder, DBconnection.js use mongoose.connect() to establish the database connection
(2) Run the server
Development mode:npm run dev
Production mode:npm start
(3)Check the logs
If you see "MongoDB Connect ...", it means you’ve successfully connected to your database.Otherwise, check the error

4.Example Data Flow
Below is an example of how data typically flows from the frontend to the backend and gets saved in MongoDB. Let’s assume we have a “Create Product” feature:
(1)Frontend (Browser/Client)

A user fills out a form with product details (e.g., name, price, description).

On form submission, the frontend sends a POST request to the backend endpoint
(2)Backend (Node.js + Express + Mongoose)

Receives the POST request at /api/products.

Extracts fields like req.body.name, req.body.price.

Uses Mongoose to create and save a new document in MongoDB

The server sends back a response indicating success or failure (JSON format).
(3)MongoDB

The new Product document is stored in the products collection.

On success, MongoDB returns an \_id (ObjectId), which you can include in your response to the frontend.

5.Folders explanation
models: define Mongoose models
controller: perform CRUD
routes: url to perform CRUD
