# 🌐 Deploying ShadowPlay AI on Render

This guide provides a step-by-step process to deploy both the **backend** (Node.js/Express Web Service) and the **frontend** (React/Vite Static Site) of **ShadowPlay AI** on Render, connected to a free MongoDB Atlas database.

---

## 🛠 Step 1: Push Your Code to GitHub

Render deploys projects directly by connecting to a GitHub repository.

1. Create a new repository on [GitHub](https://github.com).
2. Initialize Git in your project root (if not already done), commit your files, and push them to your repository:
   ```bash
   git init
   git add .
   git commit -m "Prepare for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## 💾 Step 2: Set up a Free MongoDB Atlas Database

Render does not host databases on its free tier, so using a free **MongoDB Atlas** cluster is the standard solution.

1. Go to [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) and sign up or log in.
2. Create a new project, then click **Create Database** and select the **M0 (Free)** tier.
3. Choose a provider (e.g., AWS) and region close to you, then click **Create**.
4. In the **Security Quickstart**:
   - Create a database user (e.g., username `shadowplay-user` and a strong password). **Save the password!**
   - Under **IP Access List**, add IP `0.0.0.0/0` (Allow Access from Anywhere). This is necessary because Render's web services use dynamic IP addresses that change on every deploy.
5. Once the cluster is deployed, click **Connect** -> **Drivers** (Node.js).
6. Copy the connection string. It will look like this:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
7. Replace `<username>` and `<password>` with the credentials you created in step 4. Keep this connection string ready.

---

## 🖥 Step 3: Deploy the Node.js Backend as a Render Web Service

The backend folder contains an Express app that serves the API and connects to MongoDB. We will deploy it as a Render **Web Service**.

1. Go to the [Render Dashboard](https://dashboard.render.com/) and log in.
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and click **Next**.
4. Connect your GitHub repository.
5. In the configuration settings, fill out the following fields:
   - **Name**: `shadowplay-backend`
   - **Region**: Choose the region closest to your users (e.g., Oregon, Frankfurt, Singapore).
   - **Branch**: `main`
   - **Root Directory**: `backend` (⚠️ *Very Important: This tells Render to only run actions inside the `backend` folder*)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Scroll down and click **Advanced**. Under the **Environment Variables** section, add the following variables:
   - `PORT`: `5000` (Render will bind to this port automatically, but setting it explicitly is a good practice)
   - `MONGODB_URI`: `your_mongodb_connection_string` (The full connection string from Step 2)
   - `FRONTEND_URL`: `https://shadowplay-frontend.onrender.com` (Replace this with your actual frontend Render URL after the frontend is created. For now, you can put `*` to allow any origin, or update it later)
7. Click **Create Web Service**.
8. Wait for the build and deployment to complete. Once finished, Render will display a URL for your backend at the top of the page (e.g., `https://shadowplay-backend.onrender.com`).
9. You can verify it is live by visiting `https://shadowplay-backend.onrender.com/api/health` in your browser. It should respond with `{ "status": "ok", "mongo": "connected" }`.

---

## 🎨 Step 4: Deploy the React Frontend as a Render Static Site

The frontend is a Vite React application. Since it compiles to static assets (`index.html`, JS, CSS), we can deploy it as a free **Static Site**.

1. In the [Render Dashboard](https://dashboard.render.com/), click **New +** and select **Static Site**.
2. Connect the same GitHub repository.
3. Configure the following fields:
   - **Name**: `shadowplay-frontend` (This will define your URL, e.g., `https://shadowplay-frontend.onrender.com`)
   - **Branch**: `main`
   - **Root Directory**: `frontend` (⚠️ *Very Important: This tells Render to run actions inside the `frontend` folder*)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Under the **Environment Variables** section, add:
   - `VITE_API_URL`: `https://shadowplay-backend.onrender.com` (Use the exact URL of the backend service you deployed in Step 3, without a trailing slash)
5. Click **Create Static Site**.
6. Render will build and deploy the React frontend. Once it finishes, click the URL provided (e.g., `https://shadowplay-frontend.onrender.com`) to open your live application.

---

## 🔗 Step 5: Update Backend CORS Settings (Highly Recommended)

Now that you have the final frontend URL, you should update the backend's environment variables to secure your API and prevent CORS issues.

1. Go to your backend service in the Render Dashboard.
2. Go to **Environment** settings.
3. Update `FRONTEND_URL` to the exact URL of your deployed frontend (e.g., `https://shadowplay-frontend.onrender.com`).
4. Click **Save Changes**. Render will automatically redeploy the backend with the new environment variable.

---

## 💡 Troubleshooting & Notes

- **Initial Load Time**: Render's free tier web services spin down (go to sleep) after 15 minutes of inactivity. When you open the frontend, the initial API call (like getting the leaderboard) might take **50–60 seconds** to respond because the backend is waking up. The frontend has a local storage fallback, so the game will still load, and once the backend wakes up, everything will work normally.
- **Webcam Issues**: Chrome and other modern browsers require an **HTTPS** connection to access the webcam. Deployed Render sites run on HTTPS by default, so webcam access will work perfectly.
- **Vite Environment Variables**: In Vite, environment variables must be prefixed with `VITE_` to be bundled into the production code. `VITE_API_URL` is set correctly during build time on Render.
- **Rewrites/Redirects**: If you plan to add multi-page routing (e.g., React Router) to the frontend later, you will need to add a Redirect rule on Render (`/* -> /index.html` with status `200`) so that page refreshes don't return 404 errors.
