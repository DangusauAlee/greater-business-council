import { supabase } from './supabase';
import { Toast } from '@capacitor/toast';

export const messageService = {
  // Get all conversations for current user
  async getConversations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1_profile:profiles!conversations_participant_1_fkey(id, full_name, avatar_url),
          participant_2_profile:profiles!conversations_participant_2_fkey(id, full_name, avatar_url),
          messages(content, created_at, is_read)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Transform data to match UI expectations
      const transformedData = data?.map(conv => {
        const otherUser = conv.participant_1 === user.id 
          ? conv.participant_2_profile 
          : conv.participant_1_profile;
        
        const lastMsg = conv.messages?.[conv.messages.length - 1];
        
        return {
          id: conv.id,
          with_user: {
            id: otherUser?.id || '',
            name: otherUser?.full_name || 'Unknown',
            email: '',
            avatar_url: otherUser?.avatar_url || 'https://picsum.photos/200',
            role: 'member'
          },
          last_message: lastMsg?.content || 'No messages yet',
          last_message_at: new Date(conv.last_message_at || conv.created_at).toLocaleTimeString(),
          unread_count: conv.messages?.filter(m => !m.is_read).length || 0
        };
      });

      return { data: transformedData, error: null };
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      return { data: [], error };
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return { data: [], error };
    }

    // Transform to match UI
    const { data: { user } } = await supabase.auth.getUser();
    
    const transformedData = data?.map(msg => ({
      id: msg.id,
      text: msg.content,
      sender: msg.sender_id === user?.id ? 'me' : 'them',
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: msg.type || 'text',
      media_url: msg.media_url,
      duration: msg.duration
    }));

    return { data: transformedData, error: null };
  },

  // Send a message
  async sendMessage(conversationId: string, content: string, type = 'text', mediaUrl?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          type,
          media_url: mediaUrl
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return { data, error: null };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { data: null, error };
    }
  },

  // Create or get existing conversation
  async createConversation(participantId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if conversation exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${participantId}),and(participant_1.eq.${participantId},participant_2.eq.${user.id})`)
        .single();

      if (existing) return { data: existing, error: null };

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: participantId
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      return { data: null, error };
    }
  },

  // Subscribe to new messages in real-time
  subscribeToMessages(conversationId: string, callback: (message: any) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe();
  }
};