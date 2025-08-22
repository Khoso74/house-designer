# Setup Guide for AI House Designer

## Prerequisites Installation

### 1. Install Node.js

#### Windows
1. **Download Node.js** from [https://nodejs.org/](https://nodejs.org/)
2. **Choose LTS version** (recommended for stability)
3. **Run the installer** and follow the setup wizard
4. **Verify installation** by opening a new terminal:
   ```bash
   node --version
   npm --version
   ```

#### macOS
1. **Using Homebrew** (recommended):
   ```bash
   brew install node
   ```
2. **Or download** from [https://nodejs.org/](https://nodejs.org/)

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Git (if not already installed)

#### Windows
- Download from [https://git-scm.com/](https://git-scm.com/)

#### macOS
```bash
brew install git
```

#### Linux
```bash
sudo apt-get install git
```

## Project Setup

### 1. Clone or Download the Project
```bash
git clone <repository-url>
cd ai-house-designer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## Alternative Setup Methods

### Using Yarn (if preferred)
```bash
npm install -g yarn
yarn install
yarn dev
```

### Using pnpm (faster alternative)
```bash
npm install -g pnpm
pnpm install
pnpm dev
```

## Troubleshooting

### Common Issues

#### 1. "npm is not recognized"
- **Solution**: Reinstall Node.js and ensure it's added to PATH
- **Windows**: Restart terminal after installation
- **Check PATH**: Ensure Node.js installation directory is in system PATH

#### 2. Port 3000 already in use
- **Solution**: Use a different port
  ```bash
  npm run dev -- -p 3001
  ```

#### 3. Permission errors (Linux/macOS)
- **Solution**: Use sudo or fix npm permissions
  ```bash
  sudo npm install
  # or
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  ```

#### 4. Three.js/WebGL issues
- **Solution**: Ensure your browser supports WebGL
- **Test**: Visit [https://get.webgl.org/](https://get.webgl.org/)
- **Update**: Update your graphics drivers

### System Requirements

#### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **RAM**: 4GB
- **Storage**: 1GB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

#### Recommended Requirements
- **Node.js**: 20.0.0 or higher
- **RAM**: 8GB or higher
- **Graphics**: Dedicated GPU with WebGL support
- **Browser**: Latest version of Chrome or Firefox

## Development Tools (Optional)

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**

### Browser Extensions
- **React Developer Tools**
- **Redux DevTools** (if using Redux)

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Build
```bash
npm run build
npm start
```

## Support

If you encounter issues:
1. Check this setup guide
2. Review the main README.md
3. Check Node.js and npm versions
4. Clear npm cache: `npm cache clean --force`
5. Delete node_modules and reinstall: `rm -rf node_modules && npm install`

---

**Happy coding! 🏠✨**


