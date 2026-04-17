# Supabase Migration Setup Guide

Makosa mawili yanayotokea:
1. **Database error on signup** - Trigger inayotengeneza patient records haipo
2. **Existing patient not redirecting** - RLS policies si setup

## Steps kukamatia

### Step 1: Juu kwenye Supabase Dashboard
- Nenda: https://app.supabase.com/projects
- Chagua project: `health-compass` (sfhiuxfkqisugljtosbz)
- Bofya: **SQL Editor** (kushoto sidebar)

### Step 2: Run Migration Scripts (Kwa order)

**Script 1: Simplify User Role Assignment**
```sql
-- Fix the handle_new_user trigger to handle role assignment from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient');
  
  RETURN NEW;
END;
$$;
```

**Script 2: Patient Records + Complete Trigger + RLS Policies** (CRITICAL)
- Copy content from: `/supabase/migrations/20260414061835_807a43fb-f25d-4cee-8891-fa021927447e.sql`
- This is the MOST IMPORTANT migration - creates patient records when users sign up

**Script 3: Health Entries Table**
- Copy content from: `/supabase/migrations/20260414062351_bc579acf-a4ec-4fa6-8de4-e6014f057a53.sql`

**Script 4: Assign Doctor Role (Optional)**
```sql
-- Assign doctor role to user with email ayoubzela@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'doctor'::public.app_role
FROM auth.users
WHERE email = 'ayoubzela@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Step 3: After Running Migrations

1. **Test New Signup:**
   - Open app: http://localhost:5173
   - Try signing up with new email
   - Check email confirmation link
   - After confirming, should auto-redirect to `/patient` dashboard
   - Should see onboarding welcome screen

2. **Test Existing Patient Account:**
   - Sign in with existing patient email
   - Should auto-redirect to `/patient` dashboard
   - If still blank, check browser console for errors

3. **Test Doctor Account:**
   - If set as doctor, should redirect to `/` (index dashboard)

4. **Verify Patient Record Created:**
   - Go to Supabase: **Table Editor** → `patients`
   - Check if new patient has `user_id` linked to `auth.users`

## If Migrations Fail

If nakupata error "policy already exists":
- These have been fixed already (DROP POLICY IF EXISTS added)
- Just run again

If haina patient record after signup:
- The trigger `handle_new_user` might not have fired
- Check: **Database** → **Functions** → `handle_new_user`
- Should show recently updated (April 14 2026)

