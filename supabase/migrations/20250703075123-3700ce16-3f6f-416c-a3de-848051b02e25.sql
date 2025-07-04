-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE, -- Changed from UUID to TEXT
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_plan TEXT,
  paddle_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  interval_type TEXT NOT NULL DEFAULT 'month', -- month, year
  paddle_product_id TEXT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table  
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changed from UUID to TEXT
  plan_id UUID NOT NULL, -- Removed FK to subscription_plans(id) for now as it was not in original user types and might be complex if plans change. Can be re-added if needed.
  paddle_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, past_due
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id); -- Removed ::text casts

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id) -- Removed ::text casts
WITH CHECK (auth.uid() = user_id); -- Added WITH CHECK for update consistency, also removed casts

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id); -- Removed ::text casts

-- Create policies for subscription plans (public read)
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Create policies for user subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id); -- Removed ::text casts

CREATE POLICY "Users can insert their own subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id); -- Removed ::text casts

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (name, description, price, interval_type, features,paddlePriceId) VALUES
('Free', 'Basic timer functionality', 0.00, 'month', '["Basic timer", "3 custom designs", "Local storage"]'),
('Pro', 'Advanced features and customization', 9.99, 'month', '["Unlimited timers", "All designs", "Cloud sync", "Advanced analytics", "Priority support"], "", "1"'),
('Premium', 'Everything + team features', 19.99, 'month', '["Everything in Pro", "Team collaboration", "Advanced reporting", "Custom branding", "API access"],,"", "2"');