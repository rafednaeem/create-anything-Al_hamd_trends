# Create Anything - Production Deployment Guide

## Overview

Create Anything is a full-stack application with a React web app and Expo mobile app. This guide covers setup, development, and production deployment.

## Project Structure

```
create-anything-Al_hamd_trends/
├── create-anything/_/
│   ├── apps/
│   │   ├── web/          # React Router v7 web application
│   │   └── mobile/       # Expo React Native mobile application
│   └── .github/
│       └── workflows/    # CI/CD pipelines
├── docker-compose.yml    # Docker deployment configuration
├── netlify.toml         # Netlify deployment configuration
└── README.md            # This file
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)
- Expo CLI (for mobile development)
- Git

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd create-anything-Al_hamd_trends
```

### 2. Environment Variables

Copy the environment templates and configure them:

#### Web App
```bash
cp create-anything/_/apps/web/.env.example create-anything/_/apps/web/.env
```

Configure the following variables in `create-anything/_/apps/web/.env`:
- Database URLs (PostgreSQL/Neon)
- Authentication secrets
- API keys (Stripe, Google Maps, etc.)
- CORS origins

#### Mobile App
```bash
cp create-anything/_/apps/mobile/.env.example create-anything/_/apps/mobile/.env
```

Configure mobile-specific variables in `create-anything/_/apps/mobile/.env`:
- API endpoints
- Authentication URLs
- Mobile service keys

## Development Setup

### Web Application

```bash
cd create-anything/_/apps/web
npm install
npm run dev
```

The web app will be available at `http://localhost:4000`

### Mobile Application

```bash
cd create-anything/_/apps/mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app on your mobile device.

## Production Deployment

### Option 1: Docker Deployment (Recommended)

1. **Build and run with Docker Compose:**

```bash
docker-compose up -d
```

2. **Manual Docker build:**

```bash
cd create-anything/_/apps/web
docker build -t create-anything-web .
docker run -p 4000:4000 create-anything-web
```

### Option 2: Netlify Deployment

1. Connect your repository to Netlify
2. Set build directory: `create-anything/_/apps/web/build`
3. Set build command: `npm run build` (in web directory)
4. Configure environment variables in Netlify dashboard

### Option 3: Manual Server Deployment

1. **Build the application:**

```bash
cd create-anything/_/apps/web
npm run build
```

2. **Start production server:**

```bash
npm run start
```

3. **Use PM2 for process management:**

```bash
npm install -g pm2
pm2 start npm --name "create-anything" -- start
pm2 startup
pm2 save
```

## CI/CD Pipeline

The project includes GitHub Actions workflows for automated deployment:

- **Web App**: `.github/workflows/deploy-web.yml`
- **Mobile App**: `.github/workflows/deploy-mobile.yml`

### Required GitHub Secrets

For web deployment:
- `PROD_HOST`: Production server hostname
- `PROD_USER`: SSH username
- `PROD_SSH_KEY`: SSH private key

For mobile deployment:
- `EXPO_TOKEN`: Expo access token

### Pipeline Triggers

- **Push to main**: Triggers production deployment
- **Push to develop**: Triggers staging deployment
- **Pull requests**: Triggers test and build only

## Security Configuration

### Environment Security

- Never commit `.env` files
- Use strong, unique secrets
- Rotate keys regularly
- Use different keys for development and production

### Server Security

- Configure firewall rules
- Use HTTPS with SSL certificates
- Implement rate limiting
- Regular security updates

## Monitoring and Analytics

### Recommended Services

1. **Error Tracking**: Sentry
2. **Performance**: Vercel Analytics or Google Analytics
3. **Uptime**: UptimeRobot or Pingdom
4. **Logs**: LogRocket or Papertrail

### Configuration

Add monitoring keys to your environment variables:

```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

## Database Setup

### PostgreSQL with Neon

1. Create a Neon account
2. Create a new project
3. Copy the connection string
4. Add to `.env` file:

```bash
DATABASE_URL=postgresql://username:password@hostname:port/database_name
NEON_DATABASE_URL=your_neon_database_url_here
```

## Payment Gateway Setup

### Stripe Configuration

1. Create a Stripe account
2. Get API keys from Stripe dashboard
3. Add to environment variables:

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. Configure webhook endpoints in Stripe dashboard

## Domain Configuration

### DNS Settings

1. **A Record**: Point to your server IP
2. **CNAME**: For subdomains (api, app, etc.)
3. **MX Records**: For email (if needed)

### SSL Certificate

Use Let's Encrypt for free SSL certificates:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check environment variables and dependencies
2. **Database connection**: Verify connection string and network access
3. **Authentication errors**: Check secret keys and redirect URLs
4. **Mobile build issues**: Verify Expo configuration and dependencies

### Logs and Debugging

- Web app logs: Check PM2 logs or Docker logs
- Mobile app: Use Expo CLI debugging tools
- Server logs: Check `/var/log/nginx/` or application logs

## Support

For deployment issues:
1. Check this documentation first
2. Review GitHub Actions workflow logs
3. Check application logs
4. Verify environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]
