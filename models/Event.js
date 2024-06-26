const supabase = require('../config/supabaseClient');

class Event {
  static async create(eventData) {
    const { data, error } = await supabase.from('events').insert([eventData]);
    if (error) throw error;
    return data[0];
  }

  static async findById(id) {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase.from('events').select('*');
    if (error) throw error;
    return data;
  }
}

module.exports = Event;
