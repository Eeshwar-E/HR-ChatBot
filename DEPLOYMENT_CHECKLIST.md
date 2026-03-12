# Deployment Checklist

## ✅ Files Created/Updated for Deployment

### Configuration Files

- [ ] `Procfile` - Railway process definition
- [ ] `vercel.json` - Vercel build configuration
- [ ] `.env.example` - Environment variables template (backend)
- [ ] `client/.env.example` - Environment variables template (frontend)
- [ ] `client/.env.local` - Local development environment
- [ ] `DEPLOYMENT.md` - Complete deployment guide

### Code Changes

- [ ] `client/src/config/apiConfig.js` - Centralized API URL configuration
- [ ] `client/src/components/UploadForm.jsx` - Updated to use API_BASE_URL
- [ ] `client/src/pages/Auth.jsx` - Updated to use API_BASE_URL
- [ ] `client/src/services/chatService.js` - Updated to use API_BASE_URL
- [ ] `server/index.js` - Updated CORS configuration

## 🚀 Pre-Deployment Steps

- [ ] Commit all changes to GitHub: `git add . && git commit -m "Prepare for deployment" && git push`
- [ ] Test locally one more time:
  - Start server: `cd server && npm install && npm start` (or `node index.js`)
  - Start client: `cd client && npm install && npm start`
  - Test login, signup, and file upload

## 📦 Railway Setup (Backend)

- [ ] Create Railway account and project
- [ ] Connect GitHub repository
- [ ] Add MongoDB plugin (or configure existing MongoDB URI)
- [ ] Set all environment variables (see DEPLOYMENT.md)
- [ ] Note the Railway backend URL
- [ ] Deploy and verify `/health` endpoint

## 🌐 Vercel Setup (Frontend)

- [ ] Create Vercel account and project
- [ ] Set root directory to `client/`
- [ ] Add `REACT_APP_API_URL` environment variable (Railway backend URL)
- [ ] Deploy and test application

## 🔗 Post-Deployment

- [ ] Update Railway `FRONTEND_URL` with Vercel URL
- [ ] Test login/signup flow (check CORS)
- [ ] Test file upload (check API connectivity)
- [ ] Visit `/health` endpoint to verify Gemini API connection
- [ ] Check browser console for any errors
- [ ] Monitor Railway and Vercel dashboards

## 🔐 Security Items to Review

- [ ] `.env` file is in `.gitignore` ✓ (already configured)
- [ ] `GEMINI_API_KEY` is set securely in Railway
- [ ] `JWT_SECRET` is a strong random string
- [ ] Database credentials are secure
- [ ] No sensitive information in code
- [ ] CORS is properly configured

## 📝 Documentation

- [ ] Review `DEPLOYMENT.md` for complete instructions
- [ ] Update `README.md` with deployed URL (optional)
- [ ] Document any additional environment variables

## 🐛 Troubleshooting

If deployment fails:

1. Check Railway/Vercel build logs
2. Verify all environment variables are set correctly
3. Test locally with same NODE_ENV
4. Check CORS configuration if API calls fail
5. Verify database connectivity
6. Ensure `Procfile` is in root directory
