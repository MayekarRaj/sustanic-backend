#!/bin/bash

# Quick Setup Script - Starts PostgreSQL with Docker and sets up the project

set -e

echo "🚀 Water Kiosk Backend - Quick Setup"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi
echo ""

# Start PostgreSQL
echo "🐘 Starting PostgreSQL with Docker..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is ready
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U user > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL failed to start. Check logs with: docker-compose logs postgres"
        exit 1
    fi
    sleep 1
done
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate
echo "✅ Prisma Client generated"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate
echo "✅ Migrations completed"
echo ""

# Ask about seeding
read -p "🌱 Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run prisma:seed
    echo "✅ Database seeded"
else
    echo "⏭️  Skipping seed (you can run 'npm run prisma:seed' later)"
fi
echo ""

echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Start the development server:"
echo "     npm run dev"
echo ""
echo "  2. Test the API:"
echo "     curl http://localhost:3000/health"
echo ""
echo "  3. Stop PostgreSQL when done:"
echo "     docker-compose down"
echo ""

