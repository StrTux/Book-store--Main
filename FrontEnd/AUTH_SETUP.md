# Authentication Setup Guide

This guide explains how to set up and configure the authentication system to work with your backend API.

## Configuration

The authentication system is configured to use your backend API endpoints for login, signup, and other authentication-related operations.

### Setting the Backend API URL

1. Open the `.env` file in the root of the FrontEnd directory
2. Update the `VITE_API_URL` variable with your backend API URL:

```
VITE_API_URL=https://your-backend-api.vercel.app
```

3. Save the file and restart the development server if it's running

### Authentication Endpoints

The authentication system expects the following endpoints to be available on your backend:

- **Login**: `${API_BASE_URL}/auth/login`
- **Signup**: `${API_BASE_URL}/auth/signup`
- **Logout**: `${API_BASE_URL}/auth/logout`
- **Refresh Token**: `${API_BASE_URL}/auth/refreshToken`
- **Get User Profile**: `${API_BASE_URL}/auth/me`

If your backend uses different endpoint paths, you can update them in the `FrontEnd/src/config/api.js` file.

## Response Format

The authentication system expects the following response format from your backend:

### Login/Signup Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "your-jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Testing Authentication

To test if authentication is working correctly:

1. Start your backend server
2. Start the frontend development server (`npm run dev`)
3. Navigate to the login page
4. Try to log in with valid credentials
5. Check the console for any errors

If you encounter any issues:
- Verify that your backend API is running and accessible
- Check that CORS is properly configured on your backend
- Ensure that the endpoint paths match between frontend and backend
- Check the network tab in browser developer tools for detailed error messages

## Security Considerations

- The authentication system uses HttpOnly cookies for storing tokens
- Ensure your backend properly implements CSRF protection
- Use HTTPS in production to secure the authentication process

For additional help or questions, please open an issue on the project repository. 