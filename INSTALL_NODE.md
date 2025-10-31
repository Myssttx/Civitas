# 📦 Install Node.js & npm

You need Node.js installed before deploying. Here's how:

---

## 🍎 On macOS (Your System)

### Option 1: Using Homebrew (Recommended)

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node

# Verify installation
node --version
npm --version
```

### Option 2: Direct Download (Easier)

1. **Go to:** [nodejs.org](https://nodejs.org)
2. **Download:** The LTS version (Long Term Support)
3. **Install:** Double-click the `.pkg` file
4. **Follow:** The installation wizard
5. **Verify:**
   ```bash
   node --version
   npm --version
   ```

### Option 3: Using nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc

# Install Node.js
nvm install 18
nvm use 18

# Verify
node --version
npm --version
```

---

## ✅ After Installation

### Verify it works:

```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

### If still not found:

**Restart your terminal** or run:

```bash
source ~/.zshrc
```

Or add to your PATH manually:

```bash
# Add to ~/.zshrc
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 🚀 Then Continue with Firebase

Once Node.js is installed:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Verify
firebase --version

# Login
firebase login
```

---

## 🆘 Still Having Issues?

**Check if Node.js is installed somewhere else:**

```bash
# Check common locations
which node
which npm

# Or search
find /usr/local -name node 2>/dev/null
find /opt -name node 2>/dev/null
```

**If you see "command not found" after installing:**
- Restart Terminal app completely
- Check PATH: `echo $PATH`
- Install using Homebrew (most reliable)

---

## 📝 Quick Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] npm installed (`npm --version` works)
- [ ] Terminal restarted or `source ~/.zshrc` run
- [ ] Ready to install Firebase CLI

**After Node.js is installed, continue with Firebase deployment!**

