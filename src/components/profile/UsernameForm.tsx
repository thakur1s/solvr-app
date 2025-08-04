import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const usernameSchema = z.object({
  display_name: z.string()
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
});

type UsernameFormValues = z.infer<typeof usernameSchema>;

interface UsernameFormProps {
  currentDisplayName?: string | null;
  onUsernameUpdate: (displayName: string) => void;
}

export function UsernameForm({ currentDisplayName, onUsernameUpdate }: UsernameFormProps) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingValue, setCheckingValue] = useState('');
  const { toast } = useToast();
  const { updateProfile } = useAuth();

  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      display_name: currentDisplayName || '',
    },
  });

  const watchedDisplayName = form.watch('display_name');

  // Check username availability with debounce
  useEffect(() => {
    const checkAvailability = async (username: string) => {
      if (!username || username === currentDisplayName || username.length < 2) {
        setIsAvailable(null);
        return;
      }

      setChecking(true);
      setCheckingValue(username);

      try {
        const { data, error } = await supabase
          .rpc('check_username_availability', { username });

        if (error) throw error;

        // Only update state if this is still the current value being checked
        if (username === form.getValues('display_name')) {
          setIsAvailable(data);
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
        setIsAvailable(null);
      } finally {
        setChecking(false);
      }
    };

    const timeoutId = setTimeout(() => {
      checkAvailability(watchedDisplayName);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedDisplayName, currentDisplayName, form]);

  const onSubmit = async (values: UsernameFormValues) => {
    if (isAvailable === false) {
      toast({
        title: "Username unavailable",
        description: "This username is already taken. Please choose another.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await updateProfile({ display_name: values.display_name });

      if (error) throw error;

      onUsernameUpdate(values.display_name);
      
      toast({
        title: "Username updated",
        description: "Your username has been changed successfully.",
      });
    } catch (error) {
      console.error('Error updating username:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityIcon = () => {
    if (checking && checkingValue === watchedDisplayName) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    
    if (watchedDisplayName === currentDisplayName || !watchedDisplayName || watchedDisplayName.length < 2) {
      return null;
    }

    if (isAvailable === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    
    if (isAvailable === false) {
      return <X className="h-4 w-4 text-red-500" />;
    }

    return null;
  };

  const getAvailabilityMessage = () => {
    if (checking && checkingValue === watchedDisplayName) {
      return "Checking availability...";
    }
    
    if (watchedDisplayName === currentDisplayName || !watchedDisplayName || watchedDisplayName.length < 2) {
      return null;
    }

    if (isAvailable === true) {
      return "Username is available";
    }
    
    if (isAvailable === false) {
      return "Username is already taken";
    }

    return null;
  };

  const isFormValid = form.formState.isValid && isAvailable !== false && watchedDisplayName !== currentDisplayName;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    disabled={loading}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getAvailabilityIcon()}
                  </div>
                </div>
              </FormControl>
              {getAvailabilityMessage() && (
                <p className={`text-sm ${
                  isAvailable === true ? 'text-green-600' : 
                  isAvailable === false ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {getAvailabilityMessage()}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            type="button" 
            disabled={loading}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !isFormValid}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Username
          </Button>
        </div>
      </form>
    </Form>
  );
}