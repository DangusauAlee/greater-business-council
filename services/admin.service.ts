import { supabase } from './supabase';
import { Toast } from '@capacitor/toast';

export const adminService = {
  async getPendingUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        payment_verification:payment_verifications(*)
      `)
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async approveUser(userId: string, adminId: string) {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          approval_status: 'approved',
          payment_verified: true,
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update payment verification
      const { error: paymentError } = await supabase
        .from('payment_verifications')
        .update({
          status: 'verified',
          verified_by: adminId,
          verified_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (paymentError) throw paymentError;

      // Get user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      if (profile) {
        // Send approval email via Edge Function
        await supabase.functions.invoke('send-email', {
          body: {
            to: profile.email,
            subject: 'GKBC Registration Approved! 🎉',
            html: `
              
                Welcome to GKBC!
                Dear ${profile.full_name},
                Congratulations! Your registration has been approved and your payment has been verified.
                You can now log in to the GKBC Mobile App and access all features.
                Best regards,GKBC Admin Team
              
            `
          }
        });
      }

      await Toast.show({
        text: 'User approved successfully',
        duration: 'short',
        position: 'top'
      });

      return { error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to approve user',
        duration: 'short',
        position: 'top'
      });
      return { error };
    }
  },

  async rejectUser(userId: string, reason: string, adminId: string) {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected',
          rejection_reason: reason,
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update payment verification
      const { error: paymentError } = await supabase
        .from('payment_verifications')
        .update({
          status: 'rejected',
          verified_by: adminId,
          verified_at: new Date().toISOString(),
          notes: reason
        })
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (paymentError) throw paymentError;

      // Get user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      if (profile) {
        // Send rejection email via Edge Function
        await supabase.functions.invoke('send-email', {
          body: {
            to: profile.email,
            subject: 'GKBC Registration - Payment Verification Issue',
            html: `
              
                Registration Update
                Dear ${profile.full_name},
                Unfortunately, we were unable to verify your payment at this time.
                
                  Reason: ${reason}
                
                Please contact our admin team for assistance.
                Best regards,GKBC Admin Team
              
            `
          }
        });
      }

      await Toast.show({
        text: 'User rejected with notification sent',
        duration: 'short',
        position: 'top'
      });

      return { error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to reject user',
        duration: 'short',
        position: 'top'
      });
      return { error };
    }
  },

  async isAdmin(userId: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single();

    return { isAdmin: !!data, error };
  }
};