# Setting Up KubeTools Portal

This document provides detailed instructions for setting up the KubeTools Portal project.

## Step 1: Clone the Repository

```bash
git clone https://github.com/ajeetraina/kubetools-portal.git
cd kubetools-portal
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Generate Data from README.md (Optional)

This project includes a script to parse the kubetools README.md and generate structured JSON data:

```bash
# Install node-fetch if not already installed
npm install --save-dev node-fetch

# Set GitHub token for API access (optional but recommended to avoid rate limits)
export GITHUB_TOKEN=your_github_token_here

# Run the parser script
node scripts/parseData.js
```

The script will:
1. Fetch the latest README.md from your kubetools repository
2. Parse all the tables into structured JSON data
3. Save the data to `src/data/tools.json`

## Step 4: Development

Start the development server:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Step 5: Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Step 6: Deploy to GitHub Pages

The project includes a GitHub Action workflow that automatically deploys to GitHub Pages when you push to the main branch.

Alternatively, you can manually deploy:

```bash
npm run deploy
```

## Step 7: Custom Domain Setup

To set up the custom domain (kubetools.ajeetraina.com):

1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Under "Custom domain", enter: kubetools.ajeetraina.com
4. Click "Save"

You'll also need to configure your DNS provider with:
- An A record pointing to GitHub Pages IP addresses, or
- A CNAME record pointing to your GitHub Pages site (username.github.io)

## Updating the Tools List

When you update your kubetools README.md with new tools:

1. Run the data generation script again:
   ```bash
   node scripts/parseData.js
   ```
2. Commit and push the updated data file

The GitHub Action will automatically deploy the updated site.
