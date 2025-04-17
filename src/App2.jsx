import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import matches from './data/data2.json'

const agents = ['Brimstone', 'Omen', 'Viper', 'Raze', 'Cypher',
  'Sage', 'Sova', 'Phoenix', 'Jett', 'Breach',
  'Reyna', 'Killjoy', 'Skye', 'Yoru', 'Astra',
  'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor',
  'Gekko', 'Deadlock', 'Iso', 'Clove', 'Vyse',
  'Tejo', 'Waylay']

function agents_by_map(map, action, matches) {
  /*

  */
    const agents = [
        'Brimstone', 'Omen', 'Viper', 'Raze', 'Cypher',
        'Sage', 'Sova', 'Phoenix', 'Jett', 'Breach',
        'Reyna', 'Killjoy', 'Skye', 'Yoru', 'Astra',
        'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor',
        'Gekko', 'Deadlock', 'Iso', 'Clove', 'Vyse',
        'Tejo', 'Waylay'];

    const pick_count = agents.map(agent => ({
      agent,
      count: 0
    }));

    matches.forEach(match => {
      // bo3 case
      if (match.draft_data.maps.length == 3) {
        if (match.draft_data.maps[0] == map) {
          match.draft_data.state[0].forEach(item => {
            if (item.action === action) {
              const agentEntry = pick_count.find(entry => entry.agent === item.agent);
              if (agentEntry) {
                agentEntry.count += 1;
              }
            }
          })
        }
        if (match.draft_data.maps[1] == map) {
          match.draft_data.state[1].forEach(item => {
            if (item.action === action) {
              const agentEntry = pick_count.find(entry => entry.agent === item.agent);
              if (agentEntry) {
                agentEntry.count += 1;
              }
            }
          })
        }
        if (match.draft_data.maps[2] == map) {
          match.draft_data.state[2].forEach(item => {
            if (item.action === action) {
              const agentEntry = pick_count.find(entry => entry.agent === item.agent);
              if (agentEntry) {
                agentEntry.count += 1;
              }
            }
          })
        }
      }
  })
  pick_count.sort((a,b) => b.count - a.count)
  return pick_count
}


function count_agent_map_action(agent, action, matches) {
  /*
  count_agent_map_action will return an array for how many times an agent was picked in each pick phase.

  count_agent_map_action takes 3 parameters:
  - agent
    The agent you want to track, e.g. "Omen" (Must be properly stylized, like "KAY/O" not "KAYO")
  - action
    Either "PICK" or "BAN"
  - matches
    The dataset to use, probably "matches" that was imported on the top of the script

  Ex: count_agent_map_action("Omen", "PICK", matches) will return an array
  of times Omen was picked in a match, sorted by decreasing order of the pick order
  */
  let agent_count = new Array(16).fill(0); // 16 spots for 16 pick/ban phases

  matches.forEach(match => {
    match.draft_data.state.forEach(map => {
      map.forEach(phase => {
        if (phase.agent === agent && phase.action === action) {
          agent_count[phase.phase] += 1;
        }
      });
    });
  });

  const phaseCountPairs = agent_count.map((count, phase) => ({
    phase, count
  }))
  phaseCountPairs.sort((a,b) => b.count - a.count)

  // manual overwriting of each phase correlating with # pick
  if (action == "PICK") {
    phaseCountPairs.forEach(item => {
      if (item.phase == 0) { 
        item.phase = '1st Pick'
      } else if (item.phase == 1) {
        item.phase = '2nd Pick'
      } else if (item.phase == 4) {
        item.phase = '3rd Pick'
      } else if (item.phase == 5) {
        item.phase = '4th Pick'
      } else if (item.phase == 6) {
        item.phase = '5th Pick'
      } else if (item.phase == 9) {
        item.phase = '6th Pick'
      } else if (item.phase == 10) {
        item.phase = '7th Pick'
      } else if (item.phase == 11) {
        item.phase = '8th Pick'
      } else if (item.phase == 14) {
        item.phase = '9th Pick'
      } else if (item.phase == 15) {
        item.phase = '10th Pick'
      }
    })
  }

  if (action == "BAN") {
    phaseCountPairs.forEach(item => {
      if (item.phase == 2) {
        item.phase = '1st Ban'
      } else if (item.phase == 3) {
        item.phase = '2nd Ban'
      } else if (item.phase == 7) {
        item.phase = '3rd Ban'
      } else if (item.phase == 8) {
        item.phase = '4th Ban'
      } else if (item.phase == 12) {
        item.phase = '5th Ban'
      } else if (item.phase == 13) {
        item.phase = '6th Ban'
      }
    })
  }
  return phaseCountPairs
}

function agent_team(agent, action, matches) {
  /* agent_team returns the amount of time 'agent' was 'action' by all teams
  in decreasing order

  Ex: agent_team("Omen", "PICK", matches) will return array of teams who
  picked Omen the most, in decreasing order

  agent_team takes 3 parameters:
  - agent
    The agent you want to track, e.g. "Omen" (Must be properly stylized, like "KAY/O" not "KAYO")
  - action
    Either "PICK" or "BAN"
  */
  const teamCounts = {};

  matches.forEach(match => {
    const { team_a, team_b, state } = match.draft_data;

    // state is an array of “maps”, each with an array of phase objects
    state.forEach(mapPhases => {
      mapPhases.forEach(phase => {
        if (phase.agent === agent && phase.action === action) {
          let teamName;
          if (phase.team === "A") {
            teamName = team_a;
          } else {
            teamName = team_b;
          }

          if (teamCounts[teamName]) {
            teamCounts[teamName] = teamCounts[teamName] + 1;
          } else {
            teamCounts[teamName] = 1;
          }
        }
      });
    });
  });

  return Object
    .entries(teamCounts)
    .map(([team, count]) => ({ team, count }))
    .sort((a, b) => b.count - a.count);
}

function total_in_array(array) {
// sums up values in an array
// used to find total picks/bans in an array
  let sum = 0
  array.forEach(value =>{
    sum += value.count
  })
  return sum
}

let pick_list = []
let ban_list = []

agents.forEach(agent => {
  pick_list.push({
    agent: agent,
    picks: count_agent_map_action(agent, "PICK", matches),
    total: total_in_array(count_agent_map_action(agent, "PICK", matches))
  });

  ban_list.push({
    agent: agent,
    bans: count_agent_map_action(agent, "BAN", matches),
    total: total_in_array(count_agent_map_action(agent, "BAN", matches))
  });
});

// sorts both pick_list and ban_list in decreasing order
pick_list.sort((a, b) => b.total - a.total)
ban_list.sort((a, b) => b.total - a.total)


// combinedData for graphing purposes
// aggregates the ban and pick info into one variable
const combinedData = pick_list.map(pick => {
  const ban = ban_list.find(banEntry => banEntry.agent === pick.agent);
  return {
    agent: pick.agent,
    picks: pick.total,
    bans: ban ? ban.total : 0 // if ban exists use ban.total, 0 otherwise
  };
});


const MostPickedAgentsSummary = () => {
  return (
    <div>
      <h2>Most Picked Agent</h2>
      <ul>
        {pick_list.slice(0, 1).map((entry) => (
          <li>
            <strong>{entry.agent}</strong> — Total Picks: {entry.total}
            <br></br>
            <ul>
              {entry.picks.slice(0,1).map((pick) => (
                <li>{pick.phase}: {pick.count}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MostBannedAgentsSummary = () => {
  return (
    <div>
      <h2>Most Banned Agent</h2>
      <ul>
        {ban_list.slice(0, 1).map((entry) => (
          <li>
            <strong>{entry.agent}</strong> — Total Bans: {entry.total}
            <br></br>
            <ul>
              {entry.bans.slice(0,1).map((pick) => (
                <li>{pick.phase}: {pick.count}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MostPickedAgents = () => {
  return (
    <div>
      <h2>Top 6 Picked Agents</h2>
      <ul>
        {pick_list.slice(0, 6).map((entry) => (
          <li>
            <strong>{entry.agent}</strong> — Total Picks: {entry.total}
            <br></br>
            <strong>Picks</strong>
            <ul>
              {entry.picks.slice(0,10).map((pick) => (
                <li>{pick.phase}: {pick.count}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MostBannedAgents = () => {
  return (
    <div>
      <h2>Top 6 Banned Agents</h2>
      <ul>
        {ban_list.slice(0, 6).map((entry) => (
          <li>
            <strong>{entry.agent}</strong> — Total Bans: {entry.total}
            <br></br>
            <strong>Bans</strong>
            <ul>
              {entry.bans.slice(0,6).map((pick) => (
                <li>{pick.phase}: {pick.count}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AgentPickBanHorizontalChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 2000 }}>
      <h3>Picks and Bans per Agent</h3>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="agent" />
          <Tooltip />
          <Legend />
          <Bar dataKey="picks" fill="#0c9e13" />
          <Bar dataKey="bans" fill="#fa5e5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const MostPickedByTeams = () => {
  return (
    <div>
      <h2>Top 5 Picked Agents, by Team</h2>
      <ul>
        <strong>{pick_list[0].agent}</strong> | {agent_team(pick_list[0].agent, "PICK", matches)[0].team}: {agent_team(pick_list[0].agent, "PICK", matches)[0].count}
      </ul>
      <ul>
        <strong>{pick_list[1].agent}</strong> | {agent_team(pick_list[1].agent, "PICK", matches)[0].team}: {agent_team(pick_list[1].agent, "PICK", matches)[0].count}
      </ul>
      <ul>
        <strong>{pick_list[2].agent}</strong> | {agent_team(pick_list[2].agent, "PICK", matches)[0].team}: {agent_team(pick_list[2].agent, "PICK", matches)[0].count}
      </ul>
      <ul>
        <strong>{pick_list[3].agent}</strong> | {agent_team(pick_list[3].agent, "PICK", matches)[0].team}: {agent_team(pick_list[3].agent, "PICK", matches)[0].count}
      </ul>
      <ul>
        <strong>{pick_list[4].agent}</strong> | {agent_team(pick_list[4].agent, "PICK", matches)[0].team}: {agent_team(pick_list[4].agent, "PICK", matches)[0].count}
      </ul>
    </div>
  );
};

const MostBannedByTeams = () => {
  return (
    <div>
      <h2>Top 5 Banned Agents, by Team</h2>
      <ul>
        <strong>{ban_list[0].agent}</strong> | {agent_team(ban_list[0].agent, "BAN", matches)[0].team}: {agent_team(ban_list[0].agent, "BAN", matches)[0].count}
      </ul>
      <ul>
        <strong>{ban_list[1].agent}</strong> | {agent_team(ban_list[1].agent, "BAN", matches)[0].team}: {agent_team(ban_list[1].agent, "BAN", matches)[0].count}
      </ul>
      <ul>
        <strong>{ban_list[2].agent}</strong> | {agent_team(ban_list[2].agent, "BAN", matches)[0].team}: {agent_team(ban_list[2].agent, "BAN", matches)[0].count}
      </ul>
      <ul>
        <strong>{ban_list[3].agent}</strong> | {agent_team(ban_list[3].agent, "BAN", matches)[0].team}: {agent_team(ban_list[3].agent, "BAN", matches)[0].count}
      </ul>
      <ul>
        <strong>{ban_list[4].agent}</strong> | {agent_team(ban_list[4].agent, "BAN", matches)[0].team}: {agent_team(ban_list[4].agent, "BAN", matches)[0].count}
      </ul>
    </div>
  );
};

let ascent_picklist = agents_by_map('ascent', 'PICK', matches)
let fracture_picklist = agents_by_map('fracture', 'PICK', matches)
let haven_picklist = agents_by_map('haven', 'PICK', matches)
let icebox_picklist = agents_by_map('icebox', 'PICK', matches)
let lotus_picklist = agents_by_map('lotus', 'PICK', matches)
let split_picklist = agents_by_map('split', 'PICK', matches)
let pearl_picklist = agents_by_map('pearl', 'PICK', matches)

let ascent_banlist = agents_by_map('ascent', 'BAN', matches)
let fracture_banlist = agents_by_map('fracture', 'BAN', matches)
let haven_banlist = agents_by_map('haven', 'BAN', matches)
let icebox_banlist = agents_by_map('icebox', 'BAN', matches)
let lotus_banlist = agents_by_map('lotus', 'BAN', matches)
let split_banlist = agents_by_map('split', 'BAN', matches)
let pearl_banlist = agents_by_map('pearl', 'BAN', matches)

const DataList = ({ data = [], limit = 10 }) => {
  return (
    <div>
      <ul>
        {data.slice(0, limit).map((item, index) => (
          <li key={index}>
            {item.agent}: {item.count} picks
          </li>
        ))}
      </ul>
    </div>
  );
};

const App2 = () => {
  return (
    <div>
      <h1>Agent Stats</h1>

      <AgentPickBanHorizontalChart data={combinedData} />

      <div class="row">
        <div class="column"><MostBannedByTeams /></div>
        <div class="column"><MostPickedByTeams /></div>
      </div>

      <div class="row">
        <div class="column"><MostPickedAgentsSummary /></div>
        <div class="column"><MostBannedAgentsSummary /></div>
      </div>

      <div class="row">
        <div class="column"><MostPickedAgents /></div>
        <div class="column"><MostBannedAgents /></div>
      </div>

      <div class="space"></div>
      <div class="space"></div>
      <div class="space"></div>
      <div class="space"></div>

      <div class="row">
        <div class="column">
          <h2>Most Picked Agents on Ascent:</h2>
          <DataList data={ascent_picklist} limit={10} />

          <h2>Most Picked Agents on Fracture:</h2>
          <DataList data={fracture_picklist} limit={10} />

          <h2>Most Picked Agents on Haven:</h2>
          <DataList data={haven_picklist} limit={10} />

          <h2>Most Picked Agents on Icebox:</h2>
          <DataList data={icebox_picklist} limit={10} />

          <h2>Most Picked Agents on Lotus:</h2>
          <DataList data={lotus_picklist} limit={10} />

          <h2>Most Picked Agents on Split:</h2>
          <DataList data={split_picklist} limit={10} />

          <h2>Most Picked Agents on Pearl:</h2>
          <DataList data={pearl_picklist} limit={10} />
        </div>

        <div class="column">
          <h2>Most Banned Agents on Ascent:</h2>
          <DataList data={ascent_banlist} limit={10} />

          <h2>Most Banned Agents on Fracture:</h2>
          <DataList data={fracture_banlist} limit={10} />

          <h2>Most Banned Agents on Haven:</h2>
          <DataList data={haven_banlist} limit={10} />

          <h2>Most Banned Agents on Icebox:</h2>
          <DataList data={icebox_banlist} limit={10} />

          <h2>Most Banned Agents on Lotus:</h2>
          <DataList data={lotus_banlist} limit={10} />

          <h2>Most Banned Agents on Split:</h2>
          <DataList data={split_banlist} limit={10} />

          <h2>Most Banned Agents on Pearl:</h2>
          <DataList data={pearl_banlist} limit={10} />
        </div>
      </div>

    </div>
  );
};

export default App2;