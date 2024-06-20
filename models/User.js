const supabase = require('../config/supabaseClient');

class User {
  static async create(userData) {
    const { data, error } = await supabase.from('users').insert([userData]);
    if (error) throw error;
    return data[0];
  }

  static async findByEmail(email) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }
}

module.exports = User;
