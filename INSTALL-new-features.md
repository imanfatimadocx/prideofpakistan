# New features: install steps

Run everything from the project folder (`E:\Rasekh\PrideOfPakistan\pride-of-pakistan`).

## 1. Save your current work
```powershell
git add -A; git commit -m "before new features"
```

## 2. Unzip over the project
Extract the zip into the project folder and allow it to **replace** files.
It adds new files and replaces these existing ones:

- app/components/admin/AdminNav.tsx (your current nav plus the new menu items)
- app/components/admin/RichEditor.tsx (was empty)
- app/(admin)/admin/media/page.tsx, MediaAdminClient.tsx
- app/(admin)/admin/pages/page.tsx (a proper "Pages" list; the old file was a stray copy of PageHeroEditor)
- app/(admin)/admin/pages/contact/page.tsx
- app/(public)/pride-tv/page.tsx, PrideTVPageClient.tsx
- app/(public)/contact/page.tsx, ContactPageClient.tsx
- app/(public)/terms-of-use, privacy-policy, disclaimer: page.tsx
- app/api/admin/videos/route.ts, app/api/upload/route.ts, app/api/revalidate/route.ts

## 3. Install the new package and add the small edits
```powershell
npm install sanitize-html @types/sanitize-html
node scripts/apply-feature-edits.mjs
```
The script adds the small changes to files you already have: the schema, business pages, homepage, footer and pageContent.ts.
Every line should show ✓ or • (already there). If any line shows ✗, send me the output.

## 4. Update the database
```powershell
npx prisma db push
```
This only **adds** things: `busniss.video_url`, `sponsors.website`, `sponsors.sortOrder`, and a new `video_categories` table.
If Prisma warns about **data loss** or offers to **reset**, answer **No** and send me the message.
Don't use `prisma migrate dev`. It will try to reset the Supabase database.

## 5. Restart and review
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
git diff --stat
```
Check `git diff` on the replaced files. If you'd changed any of them since 23 Sep, re-add those changes.

## 6. Deploy
Commit and push. Vercel runs `prisma generate` itself. Run `npx prisma db push` once against the production database before (or right after) deploying.

---

## Where everything is

| Feature | Admin | Public |
|---|---|---|
| Business video | Business → Edit → "Business Video" box (below the form) | Video card on /business/[id]; "Business Video" field on /list-business |
| Registered users | Overview → Registered Users (search, set new password) | – |
| Pride TV categories | Pride TV → Video Categories; category picker in Manage Videos | Category tabs on /pride-tv (also ?category=ID links) |
| Sponsors | Team & Sponsors → Sponsors (logo, link, order, show/hide) | Homepage strip + /our-sponsors |
| Pride Team | Team & Sponsors → Pride Team | /pride-team (A–Z, search, pages of 12) |
| Page headings | Pages → Pride Team Page / Sponsors Page | – |
| Contact page | Pages → Contact (heading + all contact details, social links, form text) | /contact |
| Legal pages | Pages → Terms & Conditions / Privacy Policy / Disclaimer | /terms-of-use, /privacy-policy, /disclaimer |

The first time you create a video category, all existing videos are set to "Uncategorised", because the old default of category 1 means nothing now. Then assign them in Manage Videos.
