# Blue Zone - Event-Driven Microservices Workshop

Learn modern microservices architecture with **Apache Kafka**, **Spring Boot**, **Kotlin**, and **React** by building a simplified telecom incident management system.

## 🎓 Learning Objectives

After completing this workshop, you'll have a better understanding of:

- **Event-Driven Architecture** with Apache Kafka
- **Microservices Communication** patterns
- **REST API Design** and implementation
- **Asynchronous Processing** and message queues
- **Spring Boot & Kotlin** for backend development
- **React & TypeScript** for frontend development
- **Docker Compose** for local development

---
## 🎯 What You'll Build

A complete event-driven microservices system that handles telecom network incidents from detection to resolution. You'll learn how distributed systems communicate through events and REST APIs.

**What Each Service Does:**

- **🚨 Alarm Service**: Simulates network outages, publishes incident events to Kafka
- **🎫 Ticket Service**: Automatically creates support tickets from alarm events, manages ticket lifecycle
- **👥 Customer Service**: Stores customer data
- **📧 Notification Service**: Processes events and sends notifications to affected customers
- **🖥️ Frontend Dashboard**: React-based UI for monitoring incidents and managing tickets

### Event Flow
1. Network alarm occurs → Alarm Service publishes event
2. Ticket Service consumes alarm event → Creates support ticket  
3. Ticket Service publishes ticket created event
4. Notification Service consumes ticket event → Sends customer notifications
5. Frontend displays real-time updates

## Required Software

### 📦 Installation Guide

### Windows Setup

**1. Install Docker Desktop**
```powershell
# Option 1: Download installer
# Visit: https://docs.docker.com/desktop/install/windows/
# Download and run Docker Desktop Installer.exe

# Option 2: Using Windows Package Manager
winget install Docker.DockerDesktop

# No need to create a docker account

# Enable WSL2 (if prompted)
```

**2. Install Git**
```powershell
# Download from official site
# Visit: https://git-scm.com/download/win

# Or using winget
winget install Git.Git
```

**3. Verify Installation**
```powershell
docker --version
git --version
```

### macOS Setup

You can use homebrew to install Docker Desktop and Git. To install homebrew check out https://brew.sh/

**1. Install Docker Desktop**
```bash
# Option 1: Download from official site
# Visit: https://docs.docker.com/desktop/install/mac/
# Choose the right version for your chip (Intel/Apple Silicon)

# Option 2: Using Homebrew
brew install --cask docker

# No need to create a docker account
```

**2. Install Git (usually pre-installed)**
```bash
# Check if already installed
git --version

# If not installed, use Homebrew
brew install git
```

**3. Verify Installation**
```bash
docker --version
git --version
```

### Start Docker Desktop
- **Windows**: Search for "Docker Desktop" in Start Menu
- **macOS**: Open Docker from Applications folder
- Wait for Docker to start (whale icon in system tray should be stable)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/engtho/blue-zone-workshop.git

# Then make sure you cd into the cloned repository
cd blue-zone-workshop
```

### 2. Start All Services
```bash
# Build and start all microservices with Kafka
# It can take some time to build and run it the first time
docker compose up --build

# This will start:
# - Kafka & Zookeeper (message broker)
# - 4 Spring Boot microservices  
# - React frontend
# - Kafka UI for monitoring
```

### 3. Wait for Services to Start
```bash
# Check status (all should show "healthy" or "running")
docker compose ps

# Services typically take 1-2 minutes to fully start
```

### 4. Access the Applications

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend Dashboard** | http://localhost:3000 | Main application UI |
| **Kafka UI** | http://localhost:8081 | Monitor Kafka topics/messages |

### 5. Verify Everything Works
1. Open the frontend at http://localhost:3000
2. Verify that you can see three tickets to the right
3. Click "Create Alarm" to simulate a network incident
4. Verify that a green box with "Alarm created successfully!" is shown
5. Verify that you can access http://localhost:8081

You are now ready for the workshop and can stop the services with:
```bash
docker compose down
```
---


## 🐛 Troubleshooting

### Common Docker Issues

**🔴 "Port already in use" errors**
```bash
# Find what's using the port
lsof -i :3000  # macOS
netstat -ano | findstr :3000  # Windows

# Stop conflicting services
```

### Application Issues

**🔴 Services not starting properly**
```bash
# Check logs for specific service
docker compose logs <service-name>
# E.g. 
docker compose logs ticket-service  

```

**🔴 "Connection refused" errors**
```bash
# Wait longer - services need time to initialize
# Check if all containers are running
docker compose ps

# Full restart if needed
docker compose down
docker compose up --build -d
```

**🔴 Debugging a specific service** 
```bash
# View real-time logs 
docker compose logs -f <service-name>
# E.g. 
docker compose logs -f ticket-service
```

### Performance Issues

**🔴 Slow startup times**
- Allocate more RAM to Docker Desktop (8GB recommended)
- Close other memory-intensive applications

## 🆘 Getting Help

If you're stuck:

1. **Check the troubleshooting section** above
2. **Review service logs**: `docker compose logs <service-name>`
3. **Verify all services are running**: `docker compose ps`
4. **Try a clean restart**: `docker compose down && docker compose up --build`
5. **If all else fails, create an issue on the [github page](https://github.com/engtho/blue-zone-workshop/issues/new)**

Tasks will be given at the workshop!
Happy coding! 🚀
