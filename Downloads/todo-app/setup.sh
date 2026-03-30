#!/bin/bash
echo ""
echo "╔══════════════════════════════╗"
echo "║   Taskr — Setup             ║"
echo "╚══════════════════════════════╝"
echo ""

echo "📦 Installing backend packages (express, cors, uuid)..."
cd backend && npm install
echo ""

echo "📦 Installing frontend packages (react, vite)..."
cd ../frontend && npm install
echo ""

echo "══════════════════════════════════"
echo "✅ Done! To start the app:"
echo ""
echo "  Terminal 1:  cd backend && npm run dev"
echo "  Terminal 2:  cd frontend && npm run dev"
echo ""
echo "  Then open:   http://localhost:5173"
echo "══════════════════════════════════"
echo ""
