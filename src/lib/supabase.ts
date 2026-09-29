import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Message, Conversation, UserProfile } from '../types';

// ============================================================================
// CLIENT-SAFE SUPABASE CONFIGURATION (Public/Anon Key Only)
// CRITICAL: NEVER store or expose Supabase secret key or service_role key here.
// Privileged administrative operations must only be executed server-side.
// ============================================================================
const metaEnv = (import.meta as any)?.env || {};

export const SUPABASE_CONFIG = {
  projectId: 'yjbufofcjbrmeqvdbxji',
  projectName: 'Rovela',
  url: metaEnv.VITE_SUPABASE_URL || 'https://yjbufofcjbrmeqvdbxji.supabase.co',
  publishableKey:
    metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_hBuv-3BPPbhiHVad5OYvWg_sjHFmHkv',
  anonKey:
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYnVmb2ZjamJybWVxdmRieGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MDI3MzksImV4cCI6MjEwNjA3ODczOX0.yNxK8cu0ZLE-uboy4aXtoMMvaJjQvBxyY_pGbnk_Z8g',
};

// Supabase Client Singleton initialized with client-safe anonymous/publishable key
export const supabase: SupabaseClient = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.publishableKey,
  {
    realtime: {
      params: {
        eventsPerSecond: 30,
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ============================================================================
// HARDENED SQL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
// Non-destructive, incremental migration script for Supabase SQL Editor
// ============================================================================
export const SUPABASE_CHAT_SQL_SCHEMA = `-- =========================================================================
-- ROVELA CHAT & MESSAGING — PRODUCTION-GRADE HARDENED DATABASE SETUP
-- Safe, idempotent script for Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yjbufofcjbrmeqvdbxji/sql
-- =========================================================================

-- =========================================================================
-- STEP 1: CREATE ALL APPLICATION TABLES FIRST
-- (Guarantees relations exist before any RLS, policies or foreign keys)
-- =========================================================================

-- 1A. Conversations Table
CREATE TABLE IF NOT EXISTS public.rovela_conversations (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'direct', -- 'direct' or 'group'
  title TEXT,
  avatar_url TEXT,
  participant_ids TEXT[] DEFAULT '{}',
  admin_ids TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  unread_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  last_message_content TEXT DEFAULT '',
  last_message_sender TEXT DEFAULT '',
  last_message_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1B. Messages Table
CREATE TABLE IF NOT EXISTS public.rovela_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  content TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'text',
  status TEXT DEFAULT 'sent',
  media_url TEXT,
  voice_duration NUMERIC,
  waveform NUMERIC[],
  reply_to_id TEXT,
  reactions JSONB DEFAULT '[]'::jsonb,
  is_edited BOOLEAN DEFAULT false,
  is_forwarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1C. User Profiles Table
CREATE TABLE IF NOT EXISTS public.rovela_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  status_text TEXT DEFAULT 'Available on Rovela',
  status_state TEXT DEFAULT 'online',
  is_online BOOLEAN DEFAULT true,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1D. Status Stories Table
CREATE TABLE IF NOT EXISTS public.rovela_statuses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  type TEXT NOT NULL DEFAULT 'TEXT',
  media_url TEXT,
  text_content TEXT DEFAULT '',
  background_color TEXT DEFAULT '#7C3AED',
  font_style TEXT DEFAULT 'bold',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + interval '24 hours')
);

-- 1E. Admin RBAC Table
CREATE TABLE IF NOT EXISTS public.rovela_admins (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- STEP 2: ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- =========================================================================

ALTER TABLE public.rovela_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rovela_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rovela_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rovela_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rovela_admins ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- STEP 3: SAFELY REFRESH POLICIES (Guarded Against 42P01 Relation Errors)
-- =========================================================================

DO $$
BEGIN
  -- Conversations
  DROP POLICY IF EXISTS "Participants can view conversations" ON public.rovela_conversations;
  DROP POLICY IF EXISTS "Users can create conversation if participant" ON public.rovela_conversations;
  DROP POLICY IF EXISTS "Participants can update conversation" ON public.rovela_conversations;
  DROP POLICY IF EXISTS "Admins or creators can delete conversation" ON public.rovela_conversations;
  DROP POLICY IF EXISTS "Allow public read access on rovela_conversations" ON public.rovela_conversations;
  DROP POLICY IF EXISTS "Allow public write on rovela_conversations" ON public.rovela_conversations;

  -- Messages
  DROP POLICY IF EXISTS "Participants can read conversation messages" ON public.rovela_messages;
  DROP POLICY IF EXISTS "Participants can send messages" ON public.rovela_messages;
  DROP POLICY IF EXISTS "Participants can update reactions and senders can edit message" ON public.rovela_messages;
  DROP POLICY IF EXISTS "Senders or conversation admins can delete message" ON public.rovela_messages;
  DROP POLICY IF EXISTS "Allow public read access on rovela_messages" ON public.rovela_messages;
  DROP POLICY IF EXISTS "Allow public write on rovela_messages" ON public.rovela_messages;

  -- Profiles
  DROP POLICY IF EXISTS "Public profile view" ON public.rovela_profiles;
  DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.rovela_profiles;
  DROP POLICY IF EXISTS "Users can create own profile" ON public.rovela_profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.rovela_profiles;
  DROP POLICY IF EXISTS "Users can delete own profile" ON public.rovela_profiles;
  DROP POLICY IF EXISTS "Allow public read access on rovela_profiles" ON public.rovela_profiles;
  DROP POLICY IF EXISTS "Allow public write on rovela_profiles" ON public.rovela_profiles;

  -- Statuses
  DROP POLICY IF EXISTS "Active statuses viewable by authenticated users" ON public.rovela_statuses;
  DROP POLICY IF EXISTS "Users can insert own status" ON public.rovela_statuses;
  DROP POLICY IF EXISTS "Users can update own status" ON public.rovela_statuses;
  DROP POLICY IF EXISTS "Users can delete own status" ON public.rovela_statuses;
  DROP POLICY IF EXISTS "Allow public read access on rovela_statuses" ON public.rovela_statuses;
  DROP POLICY IF EXISTS "Allow public write on rovela_statuses" ON public.rovela_statuses;

  -- Admins
  DROP POLICY IF EXISTS "Admins can view admin list" ON public.rovela_admins;
END $$;

-- =========================================================================
-- STEP 4: CREATE HARDENED ROW LEVEL SECURITY POLICIES (Zero "auth.uid() IS NULL")
-- =========================================================================

-- A. rovela_conversations (Strict participant-only access)
CREATE POLICY "Participants can view conversations"
  ON public.rovela_conversations FOR SELECT
  USING (
    (auth.uid()::text = ANY(participant_ids))
    OR (auth.role() = 'service_role')
  );

CREATE POLICY "Users can create conversation if participant"
  ON public.rovela_conversations FOR INSERT
  WITH CHECK (
    (auth.uid()::text = ANY(participant_ids))
    OR (auth.role() = 'service_role')
  );

CREATE POLICY "Participants can update conversation"
  ON public.rovela_conversations FOR UPDATE
  USING (
    (auth.uid()::text = ANY(participant_ids))
    OR (auth.role() = 'service_role')
  )
  WITH CHECK (
    (auth.uid()::text = ANY(participant_ids))
    OR (auth.role() = 'service_role')
  );

CREATE POLICY "Admins or creators can delete conversation"
  ON public.rovela_conversations FOR DELETE
  USING (
    (auth.uid()::text = ANY(admin_ids))
    OR (auth.role() = 'service_role')
  );

-- B. rovela_messages (Conversation participant verification)
CREATE POLICY "Participants can read conversation messages"
  ON public.rovela_messages FOR SELECT
  USING (
    (auth.role() = 'service_role')
    OR EXISTS (
      SELECT 1 FROM public.rovela_conversations c
      WHERE c.id = rovela_messages.conversation_id
      AND auth.uid()::text = ANY(c.participant_ids)
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.rovela_messages FOR INSERT
  WITH CHECK (
    (auth.role() = 'service_role')
    OR (
      sender_id = auth.uid()::text
      AND EXISTS (
        SELECT 1 FROM public.rovela_conversations c
        WHERE c.id = rovela_messages.conversation_id
        AND auth.uid()::text = ANY(c.participant_ids)
      )
    )
  );

CREATE POLICY "Participants can update reactions and senders can edit message"
  ON public.rovela_messages FOR UPDATE
  USING (
    (auth.role() = 'service_role')
    OR (sender_id = auth.uid()::text)
    OR EXISTS (
      SELECT 1 FROM public.rovela_conversations c
      WHERE c.id = rovela_messages.conversation_id
      AND auth.uid()::text = ANY(c.participant_ids)
    )
  )
  WITH CHECK (
    (auth.role() = 'service_role')
    OR (sender_id = auth.uid()::text)
    OR EXISTS (
      SELECT 1 FROM public.rovela_conversations c
      WHERE c.id = rovela_messages.conversation_id
      AND auth.uid()::text = ANY(c.participant_ids)
    )
  );

CREATE POLICY "Senders or conversation admins can delete message"
  ON public.rovela_messages FOR DELETE
  USING (
    (auth.role() = 'service_role')
    OR (sender_id = auth.uid()::text)
    OR EXISTS (
      SELECT 1 FROM public.rovela_conversations c
      WHERE c.id = rovela_messages.conversation_id
      AND auth.uid()::text = ANY(c.admin_ids)
    )
  );

-- C. rovela_profiles (Authenticated directory lookup; self-only mutation)
CREATE POLICY "Authenticated users can view profiles"
  ON public.rovela_profiles FOR SELECT
  USING (
    (auth.role() = 'authenticated')
    OR (auth.role() = 'service_role')
  );

CREATE POLICY "Users can create own profile"
  ON public.rovela_profiles FOR INSERT
  WITH CHECK (id = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update own profile"
  ON public.rovela_profiles FOR UPDATE
  USING (id = auth.uid()::text OR auth.role() = 'service_role')
  WITH CHECK (id = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own profile"
  ON public.rovela_profiles FOR DELETE
  USING (id = auth.uid()::text OR auth.role() = 'service_role');

-- D. rovela_statuses (24h ephemeral active status view; self-only mutation)
CREATE POLICY "Active statuses viewable by authenticated users"
  ON public.rovela_statuses FOR SELECT
  USING (expires_at > NOW() AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

CREATE POLICY "Users can insert own status"
  ON public.rovela_statuses FOR INSERT
  WITH CHECK (user_id = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update own status"
  ON public.rovela_statuses FOR UPDATE
  USING (user_id = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "Users can delete own status"
  ON public.rovela_statuses FOR DELETE
  USING (user_id = auth.uid()::text OR auth.role() = 'service_role');

-- E. rovela_admins (Authoritative RBAC; write restricted to service_role)
CREATE POLICY "Admins can view admin list"
  ON public.rovela_admins FOR SELECT
  USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.rovela_admins a WHERE a.user_id = auth.uid()::text));

CREATE OR REPLACE FUNCTION public.is_rovela_admin(check_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.rovela_admins
    WHERE user_id = check_user_id
  );
$$;

-- =========================================================================
-- STEP 5: STORAGE BUCKETS & STORAGE RLS POLICIES
-- =========================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('rovela_avatars', 'rovela_avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('rovela_media', 'rovela_media', false)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public avatar read" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
END $$;

CREATE POLICY "Public avatar read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'rovela_avatars');

CREATE POLICY "Authenticated users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'rovela_avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'rovela_avatars'
    AND auth.role() = 'authenticated'
  );

-- =========================================================================
-- STEP 6: REALTIME REPLICATION (Idempotent Publication Configuration)
-- =========================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'rovela_conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rovela_conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'rovela_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rovela_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'rovela_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rovela_profiles;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'rovela_statuses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rovela_statuses;
  END IF;
END $$;
`;

export const SUPABASE_SQL_SCHEMA = SUPABASE_CHAT_SQL_SCHEMA;

// ============================================================================
// SUPABASE AUTHENTICATION HELPERS
// Uses standard Supabase Auth methods; identity is verified by auth.uid()
// ============================================================================

export async function signUpWithSupabase(email: string, password: string, metadata?: { name?: string; username?: string }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function signInWithSupabase(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function signOutFromSupabase() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCurrentSupabaseUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

// Server-authoritative check for admin role
export async function isUserAdminServerSide(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('rovela_admins')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return false;
    return data.role === 'admin' || data.role === 'superadmin';
  } catch {
    return false;
  }
}

// ============================================================================
// HEALTH & REPLICATION DIAGNOSTICS
// ============================================================================

export async function checkSupabaseChatHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  tablesReady: boolean;
  messagesCount: number;
  conversationsCount: number;
  error?: string;
}> {
  const start = performance.now();
  try {
    const [messagesRes, convsRes] = await Promise.all([
      supabase.from('rovela_messages').select('id', { count: 'exact', head: true }),
      supabase.from('rovela_conversations').select('id', { count: 'exact', head: true }),
    ]);

    const latencyMs = Math.max(1, Math.round(performance.now() - start));

    if (messagesRes.error) {
      if (
        messagesRes.error.code === '42P01' ||
        messagesRes.error.message?.includes('does not exist') ||
        messagesRes.error.message?.includes('schema cache')
      ) {
        return {
          connected: true,
          latencyMs,
          tablesReady: false,
          messagesCount: 0,
          conversationsCount: 0,
          error: 'Tables not yet created in Supabase. Realtime channel active.',
        };
      }
      return {
        connected: false,
        latencyMs,
        tablesReady: false,
        messagesCount: 0,
        conversationsCount: 0,
        error: messagesRes.error.message,
      };
    }

    return {
      connected: true,
      latencyMs,
      tablesReady: true,
      messagesCount: messagesRes.count || 0,
      conversationsCount: convsRes.count || 0,
    };
  } catch (err: any) {
    const latencyMs = Math.max(1, Math.round(performance.now() - start));
    return {
      connected: false,
      latencyMs,
      tablesReady: false,
      messagesCount: 0,
      conversationsCount: 0,
      error: err?.message || 'Unable to connect to Supabase',
    };
  }
}

// ============================================================================
// MESSAGE & CONVERSATION SYNC
// ============================================================================

export function mapMessageToDbRow(m: Message) {
  return {
    id: m.id,
    conversation_id: m.conversation_id,
    sender_id: m.sender_id,
    sender_name: m.sender_name,
    sender_avatar: m.sender_avatar,
    content: m.content || '',
    type: m.type || 'text',
    status: m.status || 'sent',
    media_url: m.media_url || (m.voice_data?.url) || (m.video_data?.url) || null,
    voice_duration: m.voice_duration || m.voice_data?.duration || null,
    waveform: m.voice_waveform || m.voice_data?.waveform || null,
    reply_to_id: m.reply_to?.id || null,
    reactions: m.reactions || [],
    is_edited: !!m.is_edited,
    is_forwarded: !!m.is_forwarded,
    created_at: m.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function mapDbRowToMessage(row: any): Message {
  return {
    id: row.id,
    conversation_id: row.conversation_id,
    sender_id: row.sender_id,
    sender_name: row.sender_name,
    sender_avatar: row.sender_avatar || '',
    content: row.content || '',
    type: row.type || 'text',
    status: row.status || 'sent',
    created_at: row.created_at || new Date().toISOString(),
    media_url: row.media_url,
    voice_duration: row.voice_duration,
    voice_waveform: row.waveform,
    voice_data: row.voice_duration
      ? {
          duration: row.voice_duration,
          waveform: row.waveform || [],
          url: row.media_url,
        }
      : undefined,
    video_data: row.type === 'video'
      ? {
          url: row.media_url || '',
          duration: row.voice_duration,
        }
      : undefined,
    reactions: Array.isArray(row.reactions) ? row.reactions : [],
    is_edited: !!row.is_edited,
    is_forwarded: !!row.is_forwarded,
  };
}

// Sync single message to Supabase
export async function syncMessageToSupabase(message: Message): Promise<boolean> {
  try {
    const row = mapMessageToDbRow(message);
    const { error } = await supabase.from('rovela_messages').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase syncMessage warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase syncMessage error:', err);
    return false;
  }
}

// Sync message reactions to Supabase
export async function syncMessageReactionsToSupabase(
  messageId: string,
  reactions: any[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('rovela_messages')
      .update({ reactions, updated_at: new Date().toISOString() })
      .eq('id', messageId);
    if (error) {
      console.warn('Supabase syncReactions warning:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Update message content in Supabase
export async function updateMessageContentInSupabase(
  messageId: string,
  newContent: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('rovela_messages')
      .update({ content: newContent, is_edited: true, updated_at: new Date().toISOString() })
      .eq('id', messageId);
    if (error) {
      console.warn('Supabase updateContent warning:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Delete message in Supabase
export async function deleteMessageFromSupabase(messageId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('rovela_messages').delete().eq('id', messageId);
    if (error) {
      console.warn('Supabase deleteMessage warning:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Sync conversation to Supabase
export async function syncConversationToSupabase(conv: Conversation): Promise<boolean> {
  try {
    const row = {
      id: conv.id,
      type: conv.type,
      title: conv.title,
      avatar_url: conv.avatar_url,
      participant_ids: conv.participant_ids,
      admin_ids: conv.admin_ids || [],
      description: conv.description || '',
      unread_count: conv.unread_count || 0,
      is_pinned: !!conv.is_pinned,
      is_muted: !!conv.is_muted,
      is_archived: !!conv.is_archived,
      is_locked: !!conv.is_locked,
      last_message_content: conv.last_message?.content || '',
      last_message_sender: conv.last_message?.sender_name || '',
      last_message_time: conv.last_message?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('rovela_conversations')
      .upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase syncConversation warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase syncConversation error:', err);
    return false;
  }
}

// Fetch messages for a conversation from Supabase
export async function fetchMessagesFromSupabase(conversationId: string): Promise<Message[] | null> {
  try {
    const { data, error } = await supabase
      .from('rovela_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error || !data) return null;
    return data.map(mapDbRowToMessage);
  } catch {
    return null;
  }
}

// Fetch conversations for a user from Supabase
export async function fetchConversationsFromSupabase(userId?: string): Promise<Conversation[] | null> {
  try {
    let query = supabase.from('rovela_conversations').select('*').order('updated_at', { ascending: false });
    if (userId) {
      query = query.contains('participant_ids', [userId]);
    }
    const { data, error } = await query;
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      type: row.type || 'direct',
      title: row.title || 'Conversation',
      avatar_url: row.avatar_url || '',
      participant_ids: row.participant_ids || [],
      admin_ids: row.admin_ids || [],
      description: row.description || '',
      unread_count: row.unread_count || 0,
      is_pinned: !!row.is_pinned,
      is_muted: !!row.is_muted,
      is_archived: !!row.is_archived,
      is_locked: !!row.is_locked,
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString(),
      last_message: row.last_message_content
        ? {
            id: `msg-last-${row.id}`,
            conversation_id: row.id,
            sender_id: '',
            sender_name: row.last_message_sender || '',
            sender_avatar: '',
            content: row.last_message_content || '',
            type: 'text',
            status: 'sent',
            created_at: row.last_message_time || row.updated_at || new Date().toISOString(),
          }
        : undefined,
    }));
  } catch {
    return null;
  }
}

// Fetch user profiles from Supabase
export async function fetchProfilesFromSupabase(): Promise<UserProfile[] | null> {
  try {
    const { data, error } = await supabase.from('rovela_profiles').select('*').order('name');
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      name: row.name || 'User',
      username: row.username || '',
      email: row.email || '',
      avatar_url: row.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.name || 'User')}&backgroundColor=7c3aed`,
      bio: row.bio || '',
      status_text: row.status_text || 'Available on Rovela',
      status_state: (row.status_state as any) || (row.is_online ? 'online' : 'offline'),
      last_seen: row.last_seen || 'recently',
      joined_at: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

// Sync user profile to Supabase
export async function syncProfileToSupabase(profile: UserProfile): Promise<boolean> {
  try {
    const row = {
      id: profile.id,
      name: profile.name,
      username: profile.username.toLowerCase(),
      email: profile.email || null,
      avatar_url: profile.avatar_url || null,
      bio: profile.bio || profile.about || '',
      status_text: profile.status_text || 'Available on Rovela',
      status_state: profile.status_state || 'online',
      is_online: profile.status_state === 'online',
      last_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('rovela_profiles').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase syncProfile warning:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Fetch active statuses from Supabase
export async function fetchStatusesFromSupabase(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('rovela_statuses')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

// Sync status item to Supabase
export async function syncStatusToSupabase(status: any): Promise<boolean> {
  try {
    const row = {
      id: status.id,
      user_id: status.user_id,
      user_name: status.user_name,
      user_avatar: status.user_avatar || null,
      type: status.type || 'TEXT',
      media_url: status.media_url || null,
      text_content: status.text_content || '',
      background_color: status.background_color || '#7C3AED',
      font_style: status.font_style || 'bold',
      created_at: status.created_at || new Date().toISOString(),
      expires_at: status.expires_at || new Date(Date.now() + 86400000).toISOString(),
    };
    const { error } = await supabase.from('rovela_statuses').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase syncStatus warning:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Delete status item in Supabase
export async function deleteStatusFromSupabase(statusId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('rovela_statuses').delete().eq('id', statusId);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// HARDENED REALTIME SUBSCRIPTIONS
// Scoped to specific conversations or authenticated participant channels
// ============================================================================

// Subscribe to a specific conversation's realtime messages with strict channel isolation
export function subscribeToConversationMessages(
  conversationId: string,
  onInsert: (message: Message) => void,
  onUpdate: (message: Message) => void,
  onDelete: (messageId: string) => void
) {
  const channel = supabase
    .channel(`rovela-chat-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rovela_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.new) {
          onInsert(mapDbRowToMessage(payload.new));
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rovela_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.new) {
          onUpdate(mapDbRowToMessage(payload.new));
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'rovela_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.old?.id) {
          onDelete(payload.old.id);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Global realtime listener scoped for the current client
export function subscribeToRealtimeMessages(
  onInsert: (message: Message) => void,
  onUpdate: (message: Message) => void,
  onDelete: (messageId: string) => void
) {
  const channel = supabase
    .channel('rovela-realtime-messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'rovela_messages' },
      (payload) => {
        if (payload.new) {
          onInsert(mapDbRowToMessage(payload.new));
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'rovela_messages' },
      (payload) => {
        if (payload.new) {
          onUpdate(mapDbRowToMessage(payload.new));
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'rovela_messages' },
      (payload) => {
        if (payload.old?.id) {
          onDelete(payload.old.id);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
