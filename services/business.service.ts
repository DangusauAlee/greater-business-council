import { supabase } from './supabase';
import { Toast } from '@capacitor/toast';

export const businessService = {
  // Get all businesses with optional category filter
  async getBusinesses(category?: string) {
    let query = supabase
      .from('businesses')
      .select(`
        *,
        owner:profiles!businesses_owner_id_fkey(id, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching businesses:', error);
      return { data: [], error };
    }

    // Transform data to match UI expectations
    const transformedData = data?.map(business => ({
      id: business.id,
      name: business.name,
      description: business.description,
      address: business.address,
      logo_url: business.logo_url,
      cover_image_url: business.cover_image_url,
      category: business.category,
      rating: business.rating || 0,
      is_verified: business.is_verified,
      email: business.email,
      phone: business.phone,
      website: business.website,
      operating_hours: business.operating_hours,
      products_services: business.products_services,
      owner_name: business.owner?.full_name,
      owner_avatar: business.owner?.avatar_url,
      is_owned: false // Will be set based on current user
    }));

    return { data: transformedData, error: null };
  },

  // Get single business by ID
  async getBusiness(id: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        owner:profiles!businesses_owner_id_fkey(id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching business:', error);
      return { data: null, error };
    }

    // Transform data
    const transformedData = {
      id: data.id,
      name: data.name,
      description: data.description,
      address: data.address,
      logo_url: data.logo_url,
      cover_image_url: data.cover_image_url,
      category: data.category,
      rating: data.rating || 0,
      is_verified: data.is_verified,
      email: data.email,
      phone: data.phone,
      website: data.website,
      operating_hours: data.operating_hours,
      products_services: data.products_services,
      owner_name: data.owner?.full_name,
      owner_avatar: data.owner?.avatar_url
    };

    return { data: transformedData, error: null };
  },

  // Create new business
  async createBusiness(businessData: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...businessData,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await Toast.show({
        text: 'Business created successfully!',
        duration: 'short',
        position: 'top'
      });

      return { data, error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to create business',
        duration: 'short',
        position: 'top'
      });
      return { data: null, error };
    }
  },

  // Update business
  async updateBusiness(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await Toast.show({
        text: 'Business updated successfully',
        duration: 'short',
        position: 'top'
      });

      return { data, error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to update business',
        duration: 'short',
        position: 'top'
      });
      return { data: null, error };
    }
  },

  // Delete business
  async deleteBusiness(id: string) {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await Toast.show({
        text: 'Business deleted',
        duration: 'short',
        position: 'top'
      });

      return { error: null };
    } catch (error: any) {
      await Toast.show({
        text: error.message || 'Failed to delete business',
        duration: 'short',
        position: 'top'
      });
      return { error };
    }
  },

  // Get user's businesses
  async getUserBusinesses(userId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', userId);

    return { data, error };
  }
};