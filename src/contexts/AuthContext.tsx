import React, { createContext, useContext, useEffect, useState } from "react";
import { logger } from "../utils/logger";
import { tracking } from "../utils/tracking";
import { User, UserRole } from "../types";
import { supabase } from "../lib/supabase";
import { sandboxData } from "../lib/sandbox-mock-data";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);

          if (parsedUser.center_id) {
            const fetchFreshData = async (userToUpdate: User) => {
              try {
                const updatedUser = { ...userToUpdate };
                let hasChanges = false;

                const { data: centerData } = await supabase
                  .from('centers')
                  .select('name')
                  .eq('id', userToUpdate.center_id!)
                  .maybeSingle();

                if (centerData && centerData.name !== userToUpdate.center_name) {
                  updatedUser.center_name = centerData.name;
                  hasChanges = true;
                }

                const { data: centerPerms } = await supabase
                  .from('center_feature_permissions')
                  .select('*')
                  .eq('center_id', userToUpdate.center_id!)
                  .maybeSingle();

                if (centerPerms) {
                  updatedUser.centerPermissions = centerPerms;
                  hasChanges = true;
                }

                if (userToUpdate.role === 'teacher' && userToUpdate.teacher_id) {
                  const { data: teacherPerms } = await supabase
                    .from('teacher_feature_permissions')
                    .select('*')
                    .eq('teacher_id', userToUpdate.teacher_id)
                    .maybeSingle();

                  if (teacherPerms) {
                    updatedUser.teacherPermissions = teacherPerms;
                    updatedUser.teacher_scope_mode = teacherPerms.teacher_scope_mode || 'restricted';
                  } else {
                    updatedUser.teacher_scope_mode = 'restricted';
                  }
                  hasChanges = true;
                }

                if (hasChanges) {
                  updatedUser.untrusted_metadata = {
                    permissions_fetched_at: new Date().toISOString(),
                    is_ui_restricted: updatedUser.teacher_scope_mode === 'restricted'
                  };
                  setUser(updatedUser);
                  localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                }
              } catch (err) {
                logger.error("Error fetching fresh permissions:", err);
              }
            };

            fetchFreshData(parsedUser);
          }
        } catch (e) {
          logger.error("Failed to parse auth_user", e);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    logger.debug('AuthContext: login function called');

    try {
      logger.debug('AuthContext: Preparing to invoke auth-login Edge Function...');
      const { data, error: invokeError } = await (supabase as any).functions.invoke('auth-login', {
        body: { username, password } 
      });
      
      if (invokeError) {
        logger.error('AuthContext: Edge Function invocation error:', invokeError);
        tracking.trackEvent('error', 'login_exception', { error: invokeError.message });
        return { success: false, error: invokeError.message || 'Login failed' };
      }

      if (!data || !data.success) {
        logger.error('AuthContext: Login failed from Edge Function:', data?.error);
        tracking.trackEvent('error', 'login_failed', { error: data?.error });
        return { success: false, error: data?.error || 'Invalid username or password' };
      }

      const loggedInUser: User = data.user;
      const session = data.session;

      if (session) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }

      let updatedUser = { ...loggedInUser };

      if (loggedInUser.center_id) {
        const { data: centerPerms } = await supabase
          .from('center_feature_permissions')
          .select('*')
          .eq('center_id', loggedInUser.center_id)
          .maybeSingle();

        if (centerPerms) {
          updatedUser.centerPermissions = centerPerms;
        }

        if (loggedInUser.role === 'teacher' && loggedInUser.teacher_id) {
          const { data: teacherPerms } = await supabase
            .from('teacher_feature_permissions')
            .select('*')
            .eq('teacher_id', loggedInUser.teacher_id)
            .maybeSingle();

          if (teacherPerms) {
            updatedUser.teacherPermissions = teacherPerms;
            updatedUser.teacher_scope_mode = teacherPerms.teacher_scope_mode || 'restricted';
          }
        }
      }

      updatedUser.untrusted_metadata = {
        permissions_fetched_at: new Date().toISOString(),
        is_ui_restricted: updatedUser.teacher_scope_mode === 'restricted'
      };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error: any) {
      logger.error('AuthContext: Login error caught in client-side:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('is_sandbox');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
