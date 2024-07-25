
const supabase = require("../config/supabaseClient");

class Vote {
  static async create(hashedUserId, eventId, option) {
    console.log("vote data", hashedUserId, eventId, option)

    const { data, error } = await supabase.rpc("create_vote", {
      hashed_user_id: hashedUserId,
      event_id: eventId,
      option: option,
    });

    if (error) throw error;
    return data;
  }

  static async findByEventId(eventId) {
    const { data, error } = await supabase
      .from("votes")
      .select("event_id, user, option")
      .eq("event_id", eventId);
    if (error) {
      console.log("Db error:", error);
      throw error;
    }

    return data;
  }

  static async findAll() {
    const { data, error } = await supabase.from("votes").select("*");
    if (error) throw error;
    return data;
  }


  static getResults = (event, votes) => {
    let results = [];
  
    // Assurez-vous que limit_date et la date actuelle sont des objets Date
    const eventLimitDate = new Date(event.limit_date);
    const currentDate = new Date();
  
    // Si la date limite de l'événement est dépassée
    if (eventLimitDate < currentDate) {
      results = event.options.map((option) => {
        const count = votes.filter((vote) => vote.option === option).length;
        return {
          option,
          count,
          percentage: votes.length > 0 ? (count / votes.length) * 100 : 0,
        };
      });
    }
  
    return results;
  };
}
module.exports = Vote;
