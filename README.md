# 🔄 SkillSwap Circle

> **A circular economy of knowledge where everyone teaches and everyone learns**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://skill-swap-circle.vercel.app/)
[![IBM Hackathon 2026](https://img.shields.io/badge/IBM%20Hackathon-2026-blue)](https://github.com/Haizhouzhou/skill-swap-circle)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**🏆 IBM Hackathon 2026 Submission**

[🌐 Live Demo](https://skill-swap-circle.vercel.app/) | [📖 User Story](https://www.notion.so/User-story-352dc30f9ae4803894edf13606433d66) | [🛠️ Tech Plan](https://www.notion.so/Tech-plan-352dc30f9ae480c1bc45cb783ddf9590) | [📂 GitHub](https://github.com/Haizhouzhou/skill-swap-circle)

---

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Roadmap](#️-roadmap)
- [Team](#-team)

---

## 🎯 The Problem

Education today faces critical challenges:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  💰  Expensive                                      │
│      Online courses: $200+                          │
│      Degrees: $50,000+                              │
│                                                     │
│  🚫  Inaccessible                                   │
│      750M adults lack basic education               │
│      Billions can't afford quality learning         │
│                                                     │
│  ⬇️   One-Way                                       │
│      Passive consumption                            │
│      No knowledge exchange                          │
│                                                     │
│  😔  Isolating                                      │
│      Learn alone                                    │
│      No community support                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**The Core Issue**: Everyone has skills to teach AND skills to learn, but there's no easy way to exchange them.

---

## 💡 Our Solution

**SkillSwap Circle** creates a circular economy of knowledge where:
- 🎸 You teach what you know
- 🇪🇸 You learn what you need  
- 🎉 Everyone wins

### The Circular Model

```
                    ┌─────────────────┐
                    │   Sarah         │
                    │   Teaches: 🎸   │
                    │   Wants: 🇪🇸     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Smart Matching │
                    │    Algorithm    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Carlos        │
                    │   Teaches: 🇪🇸   │
                    │   Wants: 🎸      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Skill Exchange │
                    │   30-min video  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Both Learn &   │
                    │  Earn Karma 🏆  │
                    └─────────────────┘
```

### Why It Works

| Traditional Learning | SkillSwap Circle |
|---------------------|------------------|
| 💰 $200+ per course | 💚 Free |
| ⬇️ One-way | 🔄 Bidirectional |
| 😔 Alone | 🤝 Community |
| 📚 Passive | 📹 Interactive |
| ❌ No motivation | 🎮 Gamified |

---

## 🔄 How It Works

### User Journey

```
Step 1: Sign Up (90 seconds)
┌─────────────────────────────────┐
│ • Create account                │
│ • List 3 skills you can teach   │
│ • List 3 skills you want        │
└─────────────────────────────────┘
              ↓
Step 2: Get Matched (60 seconds)
┌─────────────────────────────────┐
│ • AI finds compatible partners  │
│ • Based on skills & availability│
│ • See profile & reviews         │
└─────────────────────────────────┘
              ↓
Step 3: Exchange Skills (30 min)
┌─────────────────────────────────┐
│ • Schedule session              │
│ • Video chat (15 min each way)  │
│ • Interactive learning          │
└─────────────────────────────────┘
              ↓
Step 4: Grow Together
┌─────────────────────────────────┐
│ • Rate experience               │
│ • Earn karma points             │
│ • Build your network            │
│ • Pass knowledge forward        │
└─────────────────────────────────┘
```

---

## ✨ Key Features

### 🤝 Smart Matching
- AI-powered algorithm pairs you with compatible skill partners
- Considers skills, time zones, learning styles, and availability
- Find your perfect match in under 60 seconds

### 🎮 Gamification
- **Karma Points**: Earn points for teaching and learning
- **Achievement Badges**: Unlock milestones as you progress
- **Leaderboards**: See top contributors in the community
- **Streaks**: Build learning habits with daily tracking

### 📊 Impact Tracking
Track your contribution to the community:
- ⏰ Hours of knowledge shared
- 👥 Number of people helped
- 💰 Money saved (vs traditional courses)
- 🌱 Environmental impact (CO2 saved)

### 🔗 Skill Chains
Watch your knowledge spread exponentially:

```
                You (Guitar)
                     │
                     ↓
               Carlos (Spanish)
                ↙         ↘
               ↓           ↓
        Maria (Cooking)  Tom (Coding)
            ↓               ↓
       Lisa (Design)   Sam (Photo)

1 skill taught → 5+ people impacted
```

### 🌍 Community Features
- User profiles with skills and reviews
- Session scheduling and reminders
- In-app messaging
- Community guidelines and safety

---

## 🏗️ Architecture

### System Overview

```
┌───────────────────────────────────────────────────┐
│              Frontend (React/Next.js)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │ Matching │  │  Profile │       │
│  │    UI    │  │    UI    │  │    UI    │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼──────────────┘
        │             │             │
        │      REST API / WebSocket │
        │             │             │
┌───────▼─────────────▼─────────────▼──────────────┐
│           Backend (Node.js/Express)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │ Matching │  │   User   │       │
│  │ Service  │  │  Engine  │  │ Service  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼──────────────┘
        │             │             │
        │      Database Queries     │
        │             │             │
┌───────▼─────────────▼─────────────▼──────────────┐
│            Database (PostgreSQL)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Users   │  │  Skills  │  │ Sessions │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
```
⚛️  React/Next.js      - Modern UI framework
🎨  Tailwind CSS       - Responsive styling
📊  Chart.js           - Data visualizations
🔐  NextAuth.js        - Authentication
```

### Backend
```
🟢  Node.js/Express    - API server
🗄️  PostgreSQL         - Database
🔒  JWT                - Secure tokens
📧  SendGrid           - Email notifications
```

### Infrastructure
```
☁️  Vercel             - Hosting & deployment
🌐  CDN                - Global content delivery
📈  Analytics          - User tracking
🔒  SSL/TLS            - Encrypted connections
```

### Development Tools
```
📝  TypeScript         - Type safety
🧪  Jest               - Testing
🎯  ESLint             - Code quality
🔄  GitHub Actions     - CI/CD
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
postgresql >= 14.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Haizhouzhou/skill-swap-circle.git
cd skill-swap-circle
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
```

4. **Set up the database**
```bash
npm run db:setup
npm run db:migrate
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Check code quality
```

---

## 🛣️ Roadmap

### Current Status (Hackathon MVP)

```
┌─────────────────────────────────────────────────┐
│ ✅ Completed Features                           │
├─────────────────────────────────────────────────┤
│ • User authentication & profiles                │
│ • Skill listing (teach/learn)                   │
│ • Basic matching algorithm                      │
│ • User interface & navigation                   │
│ • Database schema & models                      │
│ • Deployment pipeline                           │
└─────────────────────────────────────────────────┘
```

### Future Enhancements

```
Phase 1: Core Features (Post-Hackathon)
├─ Video chat integration
├─ Session scheduling
├─ Rating & review system
├─ Karma points system
└─ Achievement badges

Phase 2: Growth Features
├─ Advanced matching algorithm
├─ Skill chains tracking
├─ Impact dashboard
├─ Social sharing
└─ Referral system

Phase 3: Scale
├─ Mobile apps (iOS/Android)
├─ Multi-language support
├─ Team challenges
├─ Company partnerships
└─ Skill certifications

Phase 4: Ecosystem
├─ Employer recognition
├─ Public API
├─ Community events
├─ Global expansion
└─ Skill verification
```

---

## 🎯 IBM Hackathon 2026

### Challenge: "Build an Interactive Web App That Makes Life Better"

**How SkillSwap Circle Meets the Criteria:**

✅ **Interactive**
- Real-time skill exchange (planned video sessions)
- Community-driven platform
- Active participation required

✅ **Web App**
- Accessible from any device
- No installation needed
- Progressive web app capabilities

✅ **Makes Life Better**
- Democratizes education (free for everyone)
- Builds communities (connects people globally)
- Measurable social impact
- Reduces educational inequality
- Environmental benefits (no travel needed)

### Our Differentiators

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. Zero Cost                                   │
│     Unlike Udemy, Coursera, Skillshare          │
│                                                 │
│  2. Bidirectional Learning                      │
│     Everyone teaches AND learns                 │
│                                                 │
│  3. Community-Driven                            │
│     Build connections, not just transactions    │
│                                                 │
│  4. Gamified Experience                         │
│     Makes learning fun and engaging             │
│                                                 │
│  5. Measurable Impact                           │
│     Track your contribution to society          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Design Philosophy

### User-Centric Design
- Simple, intuitive interface
- Minimal clicks to value
- Mobile-first approach
- Accessibility built-in

### Visual Identity
- Clean, modern aesthetic
- Friendly, approachable tone
- Consistent color scheme
- Clear information hierarchy

---

## 📊 Potential Impact

### Vision for Scale

```
Year 1:  100,000 users
         ████████████████████

Year 2:  1,000,000 users
         ████████████████████████████████████████

Year 3:  10,000,000 users
         ████████████████████████████████████████████████████████
```

### Social Impact Goals

- **Education Access**: Make learning free for everyone
- **Community Building**: Connect people across borders
- **Economic Mobility**: Enable career growth through skills
- **Environmental**: Reduce carbon footprint of education
- **Social Good**: Create positive feedback loops

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 👥 Team

Built with ❤️ for the IBM Hackathon 2026

**Special Thanks**:
- IBM for hosting this amazing hackathon
- Our mentors and advisors
- The open-source community
- Early testers and supporters

---

## 📄 Documentation

- [User Story](https://www.notion.so/User-story-352dc30f9ae4803894edf13606433d66) - Product vision and user journeys
- [Tech Plan](https://www.notion.so/Tech-plan-352dc30f9ae480c1bc45cb783ddf9590) - Technical architecture and decisions
- [GitHub Repository](https://github.com/Haizhouzhou/skill-swap-circle) - Source code

---

## 📞 Contact

- 🌐 Website: [skill-swap-circle.vercel.app](https://skill-swap-circle.vercel.app/)
- 📧 Email: team@skillswap.circle
- 📂 GitHub: [@Haizhouzhou](https://github.com/Haizhouzhou/skill-swap-circle)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Our Mission

> **To democratize education and create a global knowledge commons where everyone can teach and everyone can learn.**

Education should be a human right, not a luxury. SkillSwap Circle is our contribution to making that vision a reality.

---

## 💬 Testimonials (Vision)

> "Imagine learning Spanish from someone in Mexico while teaching them guitar. That's the future we're building." - The Team

> "Every person has knowledge worth sharing. SkillSwap Circle makes it possible." - Our Vision

> "Free education, real connections, measurable impact. That's what the world needs." - Our Mission

---

<div align="center">

**🏆 IBM Hackathon 2026 Submission**

**Made with 💚 for a better world**

[Try SkillSwap Circle →](https://skill-swap-circle.vercel.app/)

⭐ Star us on GitHub if you believe in our mission!

</div>
