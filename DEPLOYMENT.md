# Deployment Guide - Resume Evaluator

This guide provides step-by-step instructions to deploy the Resume Evaluator application using **Vercel** (frontend) and **Railway** (backend).

## Prerequisites

1. **Git Repository**: Push your code to GitHub

   ```bash
   git add .
   git commit -m "Add deployment configurations"
   git push
   ```

2. **Create Accounts**:
   - [Vercel](https://vercel.com) - for frontend deployment
   - [Railway](https://railway.app) - for backend deployment
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - if not already set up
   - [PostgreSQL Database](https://railway.app) - can be set up through Railway

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Choose **"Deploy from GitHub"**
4. Select your GitHub repository
5. Railway will auto-detect it as a Node.js project

### Step 2: Add Database Services

#### For MongoDB (already configured):

- Railway will prompt you to add plugins
- Add **MongoDB** plugin (Railway provides hosted MongoDB)
- Or use your existing MongoDB Atlas connection

#### For PostgreSQL (if needed):

- Add **PostgreSQL** plugin in Railway
- Note the credentials

### Step 3: Set Environment Variables

In the Railway dashboard:

1. Go to **Variables** tab
2. Add the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key (generate a strong random string)
GEMINI_API_KEY=your-gemini-api-key
LLM_PROVIDER=gemini
PG_USER=postgres
PG_HOST=your_db_host (from PostgreSQL plugin if used)
PG_DATABASE=your_db_name
PG_PASSWORD=your_db_password
PG_PORT=5432
FRONTEND_URL=https://your-vercel-app.vercel.app (add after frontend deployment)
```

### Step 4: Deploy

1. Railway will automatically deploy from your main branch
2. Go to **Deployments** tab to monitor the build
3. Your backend URL will be provided (e.g., `https://resume-evaluator-prod.up.railway.app`)
4. **Save this URL for the frontend configuration**

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Set the root directory to `client/`
5. Framework preset: **Create React App**

### Step 2: Configure Environment Variables

In Vercel project settings, go to **Environment Variables** and add:

```
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
```

Replace with your actual Railway backend URL from Part 1.

### Step 3: Configure Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your frontend URL will be provided (e.g., `https://resume-evaluator.vercel.app`)

---

## Part 3: Link Frontend and Backend

### Step 1: Update Backend CORS

1. Go back to Railway dashboard
2. Update `FRONTEND_URL` variable with your Vercel URL:
   ```
   FRONTEND_URL=https://resume-evaluator.vercel.app
   ```
3. Railway will automatically redeploy with the new variable

### Step 2: Verify Deployment

Test the deployment by visiting your Vercel frontend URL and:

1. Try to login or signup (tests auth endpoints)
2. Try to upload a resume (tests upload endpoint)
3. Visit `https://your-railway-backend-url/health` to check API health

---

## Environment Variables Reference

### Backend (.env)

| Variable         | Description                                               | Required             |
| ---------------- | --------------------------------------------------------- | -------------------- |
| `MONGODB_URI`    | MongoDB connection string                                 | Yes                  |
| `JWT_SECRET`     | Secret key for JWT tokens (generate strong random string) | Yes                  |
| `GEMINI_API_KEY` | Google Gemini API key                                     | Yes                  |
| `LLM_PROVIDER`   | Set to "gemini"                                           | Yes                  |
| `PG_USER`        | PostgreSQL username                                       | No (if not using PG) |
| `PG_HOST`        | PostgreSQL host                                           | No (if not using PG) |
| `PG_DATABASE`    | PostgreSQL database name                                  | No (if not using PG) |
| `PG_PASSWORD`    | PostgreSQL password                                       | No (if not using PG) |
| `PG_PORT`        | PostgreSQL port (default: 5432)                           | No                   |
| `FRONTEND_URL`   | Frontend application URL (for CORS)                       | Yes                  |
| `PORT`           | Server port (default: 5000)                               | No                   |

### Frontend (.env.local in Vercel)

| Variable            | Description                         | Required |
| ------------------- | ----------------------------------- | -------- |
| `REACT_APP_API_URL` | Backend API URL (e.g., Railway URL) | Yes      |

---

## Troubleshooting

### CORS Errors

- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that the backend is using the updated CORS configuration

### API Endpoint Errors

- Verify `REACT_APP_API_URL` in Vercel environment variables
- Check that the Railway backend URL is accessible

### Database Connection Errors

- Verify all database connection strings are correct
- Check that environmental credentials are properly escaped
- Ensure database is accessible from Railway (check IP whitelist)

### Build Failures on Vercel

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to verify

### Build Failures on Railway

- Check Railway deployment logs
- Verify Node.js version compatibility
- Ensure `Procfile` is in the root directory

---

## Rolling Back to Local Development

To switch back to local development without changing code:

1. In frontend `.env.local`:

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

2. Run your local server:

   ```bash
   cd server && npm start
   ```

3. Run your frontend:
   ```bash
   cd client && npm start
   ```

---

## Security Best Practices

1. **Never** commit `.env` file to GitHub
2. Use strong, random strings for `JWT_SECRET`
3. Keep `GEMINI_API_KEY` and database credentials private
4. Rotate secrets periodically
5. Use environment variables for all sensitive data
6. Consider using Railway's built-in secrets management

---

## Monitoring & Maintenance

### Railway Dashboard

- Monitor application logs
- Check deployment status
- View resource usage
- Set up alerts

### Vercel Dashboard

- Monitor build performance
- Check error logs
- Review analytics
- Manage deployments

### API Health Check

Test your backend health:

```bash
curl https://your-railway-url/health
```

Expected response:

```json
{
  "gemini": {
    "ok": true,
    "detail": "Gemini API is accessible"
  }
}
```

---

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)
