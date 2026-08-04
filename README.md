# FMEA

Small setup guide to run this project locally.

## Prerequisites

- Node.js 20+ (recommended: 20 or 22)
- npm 10+

Check versions:

```bash
node -v
npm -v
```

## 1. Install dependencies

From project root:

```bash
cd /home/balaji-s/j2w/FMEA/heartfelt-notes
npm install
```

## 2. Run in development mode

```bash
npm run dev
```

Open the local URL shown in terminal (usually http://localhost:5173).

## 3. Build for production

```bash
npm run build
```

Build output is generated in the dist folder.

## 4. Preview production build

```bash
npm run preview
```

## Useful scripts

- Dev server: `npm run dev`
- Production build: `npm run build`
- Development build: `npm run build:dev`
- Lint: `npm run lint`
- Format: `npm run format`

## Troubleshooting

- If dependencies are broken:

```bash
rm -rf node_modules package-lock.json
npm install
```

- If port is in use, stop old process and rerun `npm run dev`.

- To check code issues:

```bash
npm run lint
```
