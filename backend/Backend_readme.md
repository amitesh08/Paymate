# 📱 Paymate - Backend API Documentation

Paymate is a secure peer-to-peer money transfer app built with Node.js, Express, and PostgreSQL (via Prisma ORM). This backend handles user authentication, sending money, transaction history, request handling, and PDF export.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + HTTP-only cookies
- **Validation:** Zod
- **PDF Generation:** pdfkit + pdfkit-table

---

## 🔐 AUTH ROUTES

### 🔸 `POST /api/v1/auth/signup`

Registers a new user.

- **Body:** `{ name, email, password }`
- **Returns:** user info + token in HTTP-only cookie

### 🔸 `POST /api/v1/auth/signin`

Logs in existing user.

- **Body:** `{ email, password }`
- **Returns:** user info + token in HTTP-only cookie

### 🔸 `GET /api/v1/auth/me`

Returns current user profile from JWT token.

- **Requires Auth Cookie**

### 🔸 `POST /api/v1/auth/logout`

Clears the authentication cookie.

---

## 💸 TRANSACTION ROUTES

### 🔸 `POST /api/v1/transactions/sendMoney`

Transfers money from the authenticated user to another.

- **Body:** `{ receiverId, amount, note? }`
- **Authorization:** JWT cookie required

### 🔸 `GET /api/v1/transactions/txnHistory`

Fetches all transactions involving the user (sent or received).

- Sorted by most recent

### 🔸 `GET /api/v1/transactions/export-PDF`

Exports transaction history as a downloadable PDF.

- Includes amount, date, status, type (sent/received), and note
- Also shows current balance

---

## 👥 USERS ROUTES

### 🔸 `GET /api/v1/users/allUsers`

Returns a list of all users excluding the current user.

- Includes `id`, `name`, `email`, and `avatar`

### 🔸 `GET /api/v1/users/profile`

Returns detailed profile info of current logged-in user.

- Used for dashboard display (balance, name, email, etc)

---

## 💬 TRANSACTION REQUEST ROUTES

### 🔸 `POST /api/v1/requests/RequestMoney`

Request money from another user.

- **Body:** `{ receiverId, amount, note? }`
- Prevents duplicate active requests

### 🔸 `GET /api/v1/requests/incoming-request`

Returns all incoming money requests to the current user.

- Includes sender info

### 🔸 `GET /api/v1/requests/outgoing-request`

Returns all money requests sent by the user.

- Includes receiver info

### 🔸 `POST /api/v1/requests/respond-to-request`

Accept or reject a money request.

- **Body:** `{ requestId, action: "ACCEPT" | "REJECT" }`
- If `ACCEPT`, transfers money and updates status
- If `REJECT`, updates status to rejected

---

## 📄 VALIDATIONS

- All input is validated using **Zod Schemas**.
- Errors are returned with appropriate messages.

---

## 🧪 Testing Notes

- You can test routes using Postman or Thunder Client.
- Set cookies for protected routes (or use the `/signin` route).

---

## 📁 Suggested Directory Structure

```bash
src/
├── controllers/
├── routes/
├── middlewares/
├── utils/
├── config/db.js
├── prisma/
│   └── schema.prisma
└── index.js
```

---

## 🔐 Authorization Strategy

- All protected routes require the **JWT cookie**.
- Middleware ensures authentication and attaches user to `req.user`

---

## 🧠 Future Improvements

- Admin dashboard (optional)
- Email notifications for requests
- Frontend dashboard with stats
- Swagger or Postman documentation

---

## 🧾 License

MIT License
