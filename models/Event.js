const supabase = require('../config/supabaseClient');

class Event {
  static async create(eventData) {
    const { data, error } = await supabase.from('events').insert([eventData]).select()
    if (error) throw error;
    return data[0];
  }

  static async update(id, eventData) {
    const { data, error } = await supabase.from('events').update(eventData).eq('id', id);
    if (error) throw error;
    return data[0];
  }

  static async delete(id) {
    const { data, error } = await supabase.from('events').delete().eq('id', id);

    if (error) throw error;
    return data[0];
  }

  static async findById(id) {
    const { data, error } = await supabase.from('events').select('*').eq('id', id);
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Event not found');

    return data;
  }

  static async findAll() {
    const { data, error } = await supabase.from('events').select('*');
    if (error) throw error;
    return data;
  }

  static async checkEventExpired(eventId) {
    const { data, error } = await supabase.from('events').select('expires_at').eq('id', eventId).single();
    if (error) throw error;
    return new Date(data.expires_at) < new Date();
  }

  static async getEventVotesCount(eventId) {
    const { data, error } = await supabase.rpc('get_votes_count', { event: eventId });
    if (error) throw error;
    return data;
  }

}

module.exports = Event;
