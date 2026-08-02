# Deploying to Vercel

I have prepared your project for Vercel deployment by adding a `postinstall` script (`prisma generate`) in your `package.json` to ensure Prisma Client gets generated correctly on Vercel's build servers.

Follow these steps to deploy your application:

## Method 1: Deploy via GitHub (Recommended)

This is the standard and most robust method, as it sets up automatic CI/CD for your project whenever you push code.

1. **Push your changes to GitHub**

   ```bash
   git add package.json
   git commit -m "chore: add postinstall script for vercel"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New...** > **Project**
   - Import your repository: `poojarishreyas/Ticketing_System`
   - In the **Configure Project** step, Vercel will automatically detect **Next.js** as the framework.

3. **Configure Environment Variables**
   Before clicking "Deploy", expand the **Environment Variables** section and copy/paste all the variables from your local `.env` file. You can simply copy the raw text from your `.env` file and paste it into the first key input box, and Vercel will automatically parse all keys and values.

   > [!IMPORTANT]
   > Make sure to include all of the following variables:
   >
   > - `DATABASE_URL`
   > - `DIRECT_URL`
   > - `JWT_ACCESS_SECRET`
   > - `JWT_REFRESH_SECRET`
   > - `AWS_REGION`
   > - `AWS_ACCESS_KEY_ID`
   > - `AWS_SECRET_ACCESS_KEY`
   > - `AWS_S3_BUCKET_NAME`
   > - `MAIL_PROVIDER`
   > - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

4. **Deploy**
   - Click the **Deploy** button. Vercel will run the build and your app will be live in a few minutes!

---

## Method 2: Deploy via Vercel CLI (Local)

If you prefer to deploy directly from your terminal without pushing to GitHub, you can use the Vercel CLI.

1. **Run the deployment command**
   ```bash
   npx vercel
   ```
2. **Follow the prompts** to link to your Vercel account and set up the project.
3. **Upload Environment Variables**
   Once the project is linked, you will need to add your environment variables. You can do this via the command line or from the Vercel dashboard. To push your local `.env` file directly:
   ```bash
   npx vercel env push
   ```
4. **Deploy to Production**
   ```bash
   npx vercel --prod
   ```
