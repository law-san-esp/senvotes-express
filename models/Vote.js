
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
      .select("event_id, user")
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

  static getResults(event, votes) {
    let results = [];
    //if event limit is over
    //create a list of vote objects with {option, count, percentage}
    if (event.limit_date < new Date()) {
      results = event.options.map((option) => {
        const count = votes.filter((vote) => vote.option === option).length;
        return {
          option,
          count,
          percentage: (count / votes.length) * 100,
        };
      });
    }
    return results;
  }

}

module.exports = Vote;
