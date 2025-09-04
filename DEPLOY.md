# Deployment Scripts

## Quick Deploy Script (PowerShell)

```powershell
# Add all changes
git add .

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Update: $timestamp"

# Push to GitHub
git push
```

## Development Workflow

```bash
# Start both servers in separate terminals

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

## Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```
