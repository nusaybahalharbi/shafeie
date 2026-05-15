# Mobile UI Fixes Applied

Updated files:

- `app/page.tsx`
- `app/globals.css`
- `components/layout/Header.tsx`
- `components/layout/HeroSection.tsx`
- `components/chat/ChatInput.tsx`
- `components/chat/ChatMessage.tsx`
- `components/cards/CategoryCards.tsx`
- `components/cards/AyahCard.tsx`
- `components/cards/DhikrCard.tsx`

Main fixes:

- Reduced excessive mobile movement and disabled heavy animations on small screens.
- Fixed chat auto-scroll so streaming does not keep shaking the page.
- Rebuilt the mobile search/input bar with safe-area support for iPhone.
- Improved header spacing so language/theme buttons do not mix together.
- Improved category grid responsiveness.
- Improved mobile Quran/Dhikr card spacing and text wrapping.
- Added overflow-x protection to prevent sideways movement.

Deployment note:

Run:

```bash
npm run build
git add .
git commit -m "Improve mobile UI and chat bar"
git push origin main
```

Then redeploy on Vercel without build cache.
