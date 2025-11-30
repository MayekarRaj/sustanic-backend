#!/bin/bash

# Water Kiosk Backend Setup Script

echo "🚀 Setting up Water Kiosk Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from env.example..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if npx prisma db pull > /dev/null 2>&1; then
    echo "✅ Database connection successful"
    
    # Run migrations
    echo "🗄️  Running database migrations..."
    npm run prisma:migrate
    
    # Ask about seeding
    read -p "🌱 Do you want to seed the database with sample data? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Seeding database..."
        npm run prisma:seed
    fi
else
    echo "⚠️  Could not connect to database. Please check your DATABASE_URL in .env"
    echo "📝 After fixing DATABASE_URL, run: npm run prisma:migrate"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To start the production server, run:"
echo "  npm start"

