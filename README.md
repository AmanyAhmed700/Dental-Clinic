my-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── callback/ 
│   │   ├── appointments/
│   │   │   └── route.ts
│   │   ├── doctors/
│   │   │   └── route.ts
│   │   ├── blog/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   ├── notifications/
│   │   │   ├── read-all/route.ts
│   │   │   └── route.ts
│   │   ├── users/
│   │   │   └── route.ts
│   │   ├── ai/
│   │   │   └── route.ts
│   │   ├── supabase-auth/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts  
│   │
│   ├── home/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── edit/
│   │       └── page.tsx
│   ├── booking/
│   │   └── page.tsx
│   ├── notifications/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── doctors/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   └── globals.css
│
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── NotificationBell.tsx
│   ├── AiAssistant.tsx
│   ├── BookingForm.tsx
│   ├── DoctorCalendar.tsx
│   ├── BlogList.tsx
│   ├── BlogEdit.tsx
│   ├── UserList.tsx
│   ├── Footer.tsx
│   
│
├── context/
│   ├── UserContext.tsx
│   └── NotificationContext.tsx
│
├── lib/
│   ├── supabaseClient.ts   
│   ├── prisma.ts
│   ├── cloudinary.ts
│   ├── getUser.ts
│   └── auth.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── useNotifications.ts
│
├── credentials/
│   └── google-service.json
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── images…
│
├── .env.local
├── next.config.mjs
├── package.json

