import { supabase } from './supabase';
import { Toast } from '@capacitor/toast';

export const postService = {
  // Get feed for home page
  async getFeed(limit = 20) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, full_name, avatar_url),
        likes:post_likes(count),
        user_liked:post_likes!inner(user_id)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching feed:', error);
      return { data: [], error };
    }

    // Transform data to match your UI expectations
    const transformedData = data?.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      image_url: post.image_url,
      author_name: post.author?.full_name || 'Unknown',
      created_at: new Date(post.created_at).toLocaleString(),
      likes_count: post.likes?.[0]?.count || 0,
      comments_count: post.comments_count || 0,
      is_liked: post.user_liked?.length > 0
    }));

    return { data: transformedData, error: null };
  },

  // Create a new post
  async createPost(title: string, excerpt: string, imageUrl?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          title,
          excerpt,
          image_url: imageUrl,
          content: excerpt
        })
        .select()
        .single();

      if (error) throw error;

      await Toast.show({
        text: 'Post created successfully!',
        duration: 'short',
        position: 'top'
      });

      return { data, error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to create post',
        duration: 'short',
        position: 'top'
      });
      return { data: null, error };
    }
  },

  // Toggle like on a post
  async toggleLike(postId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already liked
      const { data: existing } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existing.id);
        
        // Decrement count
        await supabase
          .from('posts')
          .update({ likes_count: supabase.raw('likes_count - 1') })
          .eq('id', postId);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
        
        // Increment count
        await supabase
          .from('posts')
          .update({ likes_count: supabase.raw('likes_count + 1') })
          .eq('id', postId);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error toggling like:', error);
      return { error };
    }
  },

  // Delete a post
  async deletePost(postId: string) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      await Toast.show({
        text: 'Post deleted',
        duration: 'short',
        position: 'top'
      });

      return { error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to delete post',
        duration: 'short',
        position: 'top'
      });
      return { error };
    }
  },

  // Get user's posts
  async getUserPosts(userId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  }
};