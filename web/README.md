# ShizuStore Web Portal

A modern, responsive web catalog and discovery directory for Shizuku-compatible Android applications, powered by the upstream curated awesome-shizuku repository.

This project is a web-based companion directory designed to make finding, browsing, and sharing Shizuku apps effortless from any desktop or mobile browser, seamlessly directing users to the native ShizuStore Android installer.

## Features

- **Live Search and Filtering**: Instant search across 460+ applications by name, developer, package name, or description.
- **Filter and Category Pills**: Filter by Featured, Open Source, Free Only, and Rootless Only with quick category navigation.
- **ShizuStore Guided Installation**: Quickly copy application package identifiers for direct search and installation in ShizuStore, with direct APK downloads and source repository links.
- **Detailed Metadata**: Inspect repository stars, latest release versions, changelogs, source code links, licenses, and verified Shizuku permission requirements.
- **Neutral shadcn/ui Design**: Clean, modern zinc aesthetic with full dark and light mode support and zero visual clutter.
- **Upstream Synchronization**: Automatically parses and synchronizes applications and categories from the upstream awesome-shizuku source.

## Disclaimer

I do not own or maintain any of the applications or software listed on this web application. All trademarks, app names, logos, and repositories belong to their respective developers and owners.

> [!NOTE]
> I built this web application solely to help Android developers and users discover, showcase, and share application URLs through ShizuStore. This website is purely an informational directory; it does not host APK binaries, execute Android privilege escalation, or manage on-device installations.

## Credits and Acknowledgments

This project relies on the incredible work of the Shizuku and Android open-source communities:

- **awesome-shizuku**: Curated list and primary source of truth for Shizuku applications maintained by [timschneeb](https://github.com/timschneeb/awesome-shizuku).
- **ShizuStore**: The open-source on-device Android installer application developed by [timschneeb](https://github.com/timschneeb/ShizuStore).
- **Shizuku**: The privileged API framework developed by [Rikka](https://shizuku.rikka.app) enabling system-level API access for standard apps.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, custom shadcn/ui Neutral tokens
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, pnpm, or yarn

### Installation

1. Clone the repository and navigate to the web directory:
   ```bash
   git clone https://github.com/rdevz-ph/awesome-shizuku-web.git
   cd awesome-shizuku-web/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build and Deployment

To generate an optimized production build:

```bash
npm run build
```

This project is configured and validated for standard deployment on Vercel.

## License

This project is open-source software licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.

Copyright (C) 2026 Romel Brosas (rdevz-ph)
