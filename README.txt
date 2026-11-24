SECOND SPIN / THRIFT LENS - DESCRIPTION MATCHING FIX

Replace these files in your project, keeping the same folder paths:
- components/upload/UploadClient.tsx
- components/look/Wardrobe.tsx
- lib/matchDescription.ts
- lib/uploadSession.ts
- app/upload/page.tsx
- app/look/[id]/page.tsx

What this fixes:
1. Garment type and category matches now have more weight than generic style words.
2. Colour, fit, material and style terms are matched separately.
3. Unrequested categories are left empty instead of being filled with unrelated items.
4. The selected description result is saved in sessionStorage, so refreshing /look/description-results does not revert to the first sample look.
5. The description result page displays a description summary panel rather than the old sample-look illustration.
6. Dress Me safely handles categories with no matches.

This is rule-based keyword matching, not an AI image-recognition model. The catalogue is still the existing 30 sample products.

After replacing files, run:
  npm run build

If TypeScript reports an error, send the complete terminal output.
