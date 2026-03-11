# Portfolio / @seleneftw

A moody, minimalist personal portfolio designed for cybersecurity researchers and developers. Built with SvelteKit and Tailwind CSS, focusing on professional atmospheric aesthetics, high performance, and technical clarity.
 
## 🖼️ Screenshots

<details>
<summary><b>Home Page</b></summary>
<img src="screenshots/home.png" alt="Home Page" width="100%">
</details>

<details>
<summary><b>Projects Archive</b></summary>
<img src="screenshots/projects.png" alt="Projects Page" width="100%">
</details>

<details>
<summary><b>Contact Hub</b></summary>
<img src="screenshots/contact.png" alt="Contact Page" width="100%">
</details>

<details>
<summary><b>/uses Template</b></summary>
<img src="screenshots/uses.png" alt="Uses Page" width="100%">
</details>

## Aesthetics & Experience

- **Cinematic Dark Mode**: A deep dark theme (`#0a0a0a`) with high-opacity glassmorphic cards (`#0f0f0f/80`).
- **Granular Atmosphere**: A pronounced grainy background overlay (Stardust texture) that creates a tactile, moody feel.
- **Technical Typography**: A pairing of `Inter` for clean readability and `Space Mono` for technical labels and accents.
- **Professional Polish**: No-flash accent color generation, smooth View Transitions, and instant-start entrance animations.

## Key Systems

### 1. Unified Configuration (`src/lib/config.js`)

Virtually every aspect of the site is managed from a single file.

- **Personal Info**: Name, profession, skills, and contact details.
- **Presence**: Centralized social media links (GitHub, Discord, Telegram, Steam).
- **Uses Page**: Detailed categorization of your hardware, software, and gear.

### 2. Zero-Flash Accent System

The site generates a random accent color on the first visit, which is then persisted via cookies.

- **Server Injection**: Unlike traditional client-side themes, this system reads the cookie in `hooks.server.js` and injects CSS variables directly into the HTML before it is served.
- **Performance**: Zero flickering of default colors (the common "red flash" problem) and perfect consistency across page loads.

### 3. High-Performance Projects Archive

The `/projects` page is a robust data hub that pulls directly from the GitHub API.

- **Server-Side Caching**: Includes a 10-minute in-memory cache to ensure near-instant page loads while staying within API rate limits.
- **Language Breakdown**: Automatically analyzes your top repos to display a visual breakdown of your tech stack.
- **Graceful Failures**: If the GitHub API is unavailable, the site serves the last successfully cached version.

### 4. Interactive /uses Template

Inspired by professional developers' setups, this page provides a structured view of your daily tools.

- **Categorized Gear**: Sections for Setup, Hardware, Audio, Peripherals, and Software.
- **Config-Driven Links**: Add URLs to specific gear in the config, and the page will automatically render them as interactive links with hover arrows.

### 5. Social Presence Hub

The `/contact` page is more than just a button—it's a professional hub designed for research collaborations and technical inquiries.

- **Presence Section**: Vertical list of social platforms with interactive state transitions.
- **Professional Tone**: Structured for technical proposals, malware research discussions, and strategic partnerships.

## 🚀 Setup & Deployment

### Installation

```bash
# Clone the repository
# Navigate to the root directory
npm install
```

### Development

```bash
npm run dev
```

### Building for Production

The site is pre-configured for SvelteKit deployment.

```bash
npm run build
```

## 📋 Customization Guide
Update your personal data in `src/lib/config.js`:

1.  **`name` & `profession`**: Controls the greeting on the home page.
2.  **`socials`**: Add or remove objects to update the Home and Contact pages simultaneously.
3.  **`uses`**: Fill in your gear. Each item can optionally take a `url`, `description`, and `name`.
4.  **`lastUpdated`**: Update the timestamp on the uses page.

---

// a simple silhouette of breakbeats bent <3
