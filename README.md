# finalExam
 # Touring Management API
## Overview
This repository includes the core files required for a Touring Management API, which enables the management of attractions, visitors, and reviews. Below is an outline of the project's structure and features:

### Files Included:
- **`models/`**: Contains the Mongoose schema definitions for models like Attraction, Visitor, and Review.
- **`routes.js`**: Contains all the API routes for handling CRUD operations and additional features like fetching top-rated attractions and visitor activity.
- **`app.js`**: Sets up the application, connects to MongoDB, and configures the necessary middlewares.

### Features:
1. **MongoDB Connectivity**: The application seamlessly connects to a MongoDB database to store and retrieve data.
2. **CRUD Operations**: Complete CRUD routes for models:
   - Visitor
   - Attraction
   - Review
3. **Special Routes**:
   - **Get Top-Rated Attractions**: Fetches the top 5 attractions based on ratings.
   - **Get Visitor Activity**: Provides a summary of visitors' activity, including visited attractions and average review scores.
4. **Business Logic**:
   - Visitors can only leave reviews for attractions they have visited.
   - Each visitor can review an attraction only once.

## Routes Overview
- **Create, Update, Get, and Delete**:
  - Supported for all models: Visitor, Attraction, and Review.
- **Additional Routes**:
  - **Top-Rated Attractions**: `/api/attractions/top-rated`
  - **Visitor Activity**: `/api/visitors/activity`

## Usage and Postman Testing
The exported Postman collection is included in the submission link. Use Postman to test the following routes:

1. **Visitors**:
   - Create, Read, Update, Delete
2. **Attractions**:
   - Create, Read, Update, Delete
3. **Reviews**:
   - Create, Read, Update, Delete
   - **Business Rule Enforced**: A review can only be added if:
     - The visitor is already registered.
     - The visitor has visited the attraction.
