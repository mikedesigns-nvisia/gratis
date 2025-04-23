-- Create the entries table
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create the user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  theme TEXT DEFAULT 'system' NOT NULL,
  notifications BOOLEAN DEFAULT true NOT NULL,
  notification_time TEXT DEFAULT '20:00' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Setup RLS (Row Level Security) for entries
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own entries
CREATE POLICY "Users can view their own entries" ON public.entries
  FOR SELECT USING (auth.uid() = user_id);

-- Only allow users to insert their own entries
CREATE POLICY "Users can insert their own entries" ON public.entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only allow users to update their own entries
CREATE POLICY "Users can update their own entries" ON public.entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Only allow users to delete their own entries
CREATE POLICY "Users can delete their own entries" ON public.entries
  FOR DELETE USING (auth.uid() = user_id);

-- Setup RLS for user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = id);

-- Only allow users to insert their own settings
CREATE POLICY "Users can insert their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Only allow users to update their own settings
CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for entries updated_at
CREATE TRIGGER set_updated_at_on_entries
BEFORE UPDATE ON public.entries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for user_settings updated_at
CREATE TRIGGER set_updated_at_on_user_settings
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.entries TO authenticated;
GRANT ALL ON public.user_settings TO authenticated;

-- Comment on tables and columns for better documentation
COMMENT ON TABLE public.entries IS 'Stores user gratitude journal entries';
COMMENT ON COLUMN public.entries.id IS 'Primary UUID for the entry';
COMMENT ON COLUMN public.entries.user_id IS 'Reference to the user who created the entry';
COMMENT ON COLUMN public.entries.content IS 'The content of the gratitude entry';
COMMENT ON COLUMN public.entries.date IS 'The date the entry was recorded for (not necessarily created_at)';

COMMENT ON TABLE public.user_settings IS 'Stores user preferences and settings';
COMMENT ON COLUMN public.user_settings.id IS 'Primary UUID for the settings (same as user id)';
COMMENT ON COLUMN public.user_settings.theme IS 'User preferred theme (light, dark, system)';
COMMENT ON COLUMN public.user_settings.notifications IS 'Whether user has enabled notifications';
COMMENT ON COLUMN public.user_settings.notification_time IS 'Time of day for notifications (HH:MM format)';
