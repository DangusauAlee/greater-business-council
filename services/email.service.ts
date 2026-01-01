import { supabase } from './supabase';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}
export async function sendEmail(payload: EmailPayload) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        from: payload.from || 'GKBC Admin '
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { data: null, error };
  }
}

// Log email notification to database
export async function logEmailNotification(
  userId: string,
  emailType: string,
  sentTo: string,
  subject: string,
  body: string,
  status: 'sent' | 'failed' = 'sent'
) {
  try {
    const { error } = await supabase
      .from('email_notifications')
      .insert({
        user_id: userId,
        email_type: emailType,
        sent_to: sentTo,
        subject,
        body,
        status
      });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Failed to log email:', error);
    return { error };
  }
}