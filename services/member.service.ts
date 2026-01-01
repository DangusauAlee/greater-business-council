import { supabase } from './supabase';
import { Toast } from '@capacitor/toast';

export const memberService = {
  // Get all members
  async getMembers() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        profile:profiles!members_user_id_fkey(id, full_name, avatar_url, email, phone, bio)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      return { data: [], error };
    }

    // Transform data to match UI expectations
    const transformedData = data?.map(member => ({
      id: member.id,
      user_id: member.user_id,
      full_name: member.profile?.full_name || 'Unknown',
      position: member.position,
      company: member.company,
      category_id: member.category_id,
      bio: member.profile?.bio || '',
      verified: member.verified,
      image_url: member.profile?.avatar_url || 'https://picsum.photos/200',
      is_friend: false // Will be determined by checking connections
    }));

    return { data: transformedData, error: null };
  },

  // Get single member
  async getMember(id: string) {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        profile:profiles!members_user_id_fkey(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching member:', error);
      return { data: null, error };
    }

    return { data, error: null };
  },

  // Get member profile (for profile page)
  async getMemberProfile(id: string) {
    const { data: member } = await this.getMember(id);
    
    if (!member) return { data: null, error: 'Member not found' };

    // Construct profile object
    const profile = {
      id: member.id,
      name: member.profile?.full_name,
      email: member.profile?.email,
      phone: member.profile?.phone,
      role: 'Member',
      bio: member.profile?.bio,
      avatar: member.profile?.avatar_url,
      is_friend: false, // Check connections table
      stats: {
        friends: 0, // Count from connections
        posts: 0,   // Count from posts
        businesses: 0 // Count from businesses
      }
    };

    return { data: profile, error: null };
  },

  // Send connection request
  async sendConnectionRequest(friendId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('connections')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await Toast.show({
        text: 'Connection request sent',
        duration: 'short',
        position: 'top'
      });

      return { data, error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to send request',
        duration: 'short',
        position: 'top'
      });
      return { data: null, error };
    }
  },

  // Accept connection
  async acceptConnection(connectionId: string) {
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;

      await Toast.show({
        text: 'Connection accepted',
        duration: 'short',
        position: 'top'
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // Get user connections
  async getConnections(userId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        friend:profiles!connections_friend_id_fkey(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');

    return { data, error };
  },

  // Check if users are connected
  async areConnected(userId: string, friendId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select('id')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .eq('status', 'accepted')
      .single();

    return { isConnected: !!data, error };
  }
};