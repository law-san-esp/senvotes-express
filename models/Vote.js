const supabase = require("../config/supabaseClient");

class Vote {
  static async create(voteData) {
    const { user, eventId, option } = voteData;

    const { data, error } = await supabase.rpc("create_vote", {
      user_id: user,
      event_id: eventId,
      option: option,
    });

    if (error) throw error;
    return data;
  }

  static async findByEventId(eventId) {
    const { data, error } = await supabase
      .from("id, option, event_id")
      .select("option")
      .eq("event_id", eventId);
    if (error) throw error;
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
