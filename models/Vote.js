const supabase = require('../config/supabaseClient');

class Vote {
  static async create(voteData) {
    const { data, error } = await supabase.from('votes').insert([voteData]);
    if (error) throw error;
    return data[0];
  }

  static async findByEventId(eventId) {
    const { data, error } = await supabase.from('votes').select('*').eq('event_id', eventId);
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase.from('votes').select('*');
    if (error) throw error;
    return data;
  }
}

module.exports = Vote;
