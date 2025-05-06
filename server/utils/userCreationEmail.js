const userCreationEmail = (name, email, role, password) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Created</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f7fa;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
          }
          .header h1 {
              font-size: 28px;
              color: #4CAF50;
              margin: 0;
          }
          .content {
              margin-top: 30px;
              text-align: center;
          }
          .content p {
              font-size: 16px;
              line-height: 1.6;
              margin: 10px 0;
          }
          .credentials {
              background-color: #f0f4f8;
              padding: 20px;
              border-radius: 8px;
              text-align: left;
              margin: 20px 0;
          }
          .credentials p {
              margin: 8px 0;
              font-size: 15px;
          }
          .btn {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 25px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
              transition: background-color 0.3s ease;
          }
          .btn:hover {
              background-color: #45a049;
          }
          .footer {
              text-align: center;
              margin-top: 40px;
              font-size: 13px;
              color: #888;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome, ${name}!</h1>
          </div>
          <div class="content">
              <p>We're excited to have you onboard!</p>
              <p>Your account has been created by the Admin with the following details:</p>
  
              <div class="credentials">
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Password:</strong> ${password}</p>
                  <p><strong>Role:</strong> ${role}</p>
              </div>
  
              <p>Please log in using these credentials and make sure to update your password after first login for security purposes.</p>
  

          </div>
  
          <div class="footer">
              <p>&copy; 2025 Mega Mart. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`;
};

export default userCreationEmail;
