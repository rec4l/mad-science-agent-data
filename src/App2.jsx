import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarGrid } from 'recharts';

import matches from './data/data2.json'

const agents = ['Brimstone', 'Omen', 'Viper', 'Raze', 'Cypher',
  'Sage', 'Sova', 'Phoenix', 'Jett', 'Breach',
  'Reyna', 'Killjoy', 'Skye', 'Yoru', 'Astra',
  'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor',
  'Gekko', 'Deadlock', 'Iso', 'Clove', 'Vyse',
  'Tejo', 'Waylay']

function agents_by_map(map, action, matches) {
  /*
  agents_by_map will return an array for how many times an agent was (action) in a match

  count_agent_map_action takes 3 parameters:
  - map
    The map you want to track (must be lowercase stylized, e.g. "split")
  - action
    Either "PICK" or "BAN"
  - matches
    The dataset to use, probably "matches" that was imported on the top of the script

  Ex: agents_by_map('split', 'PICK', matches) returns array of agents picked on split
  in decreasing order
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
      // bo3 case , note that bo5 specifically not handled
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

      // bo1 case
      if (match.draft_data.maps.length == 1) {
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
      {pick_list.slice(0, 1).map((entry) => (
        <div key={entry.agent}>
          <div className="center">
            <h3 className="agent-top-text white-text size-two-text">Most Picked Agent:</h3>
            <h2 className="agent-name">{entry.agent.toUpperCase()}</h2>
            <h3 className="agent-bottom-text">{entry.total} picks</h3>
            {entry.picks.slice(0, 1).map((pick) => (
              <p className="agent-subtext" key={pick.phase}>
                <span className="gray-text">{entry.agent}'s most common pick phase is <br /></span>
                <strong>{pick.phase} </strong>
                <span className="gray-text">with</span> <strong>{pick.count} picks</strong>.
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MostBannedAgentsSummary = () => {
  return (
    <div>
      {ban_list.slice(0, 1).map((entry) => (
        <div>
          <div className="center">
            <h3 class="agent-top-text white-text size-two-text">Most Banned Agent:</h3>
            <h2 class="agent-name">{entry.agent.toUpperCase()}</h2>
            <h3 class="agent-bottom-text">{entry.total} bans</h3>
            {entry.bans.slice(0, 1).map((ban) => (
                <p class="agent-subtext">
                  <span class="gray-text">{entry.agent}'s most common ban phase is <br /></span>
                  <strong>{ban.phase} </strong>
                  <span class="gray-text">with</span> <strong>{ban.count} bans</strong>.
                </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MostPickedAgents = () => {
  return (
    <div>
      <h2 class="size-two-text">Top 6 Picked Agents</h2>
      <table>
        <tbody>
          {pick_list.slice(0, 6).map((entry, index) => {
            const peakPick = entry.picks.sort((a, b) => b.count - a.count)[0];

            return (
              <tr>
                <td>
                  <strong className="highlight-text">
                    {index + 1}. {entry.agent.toUpperCase()}
                  </strong>
                  <div className="gray-text size-three-text">
                    {entry.picks
                      .slice(0, 10)
                      .map((pick) => `${pick.phase}: ${pick.count}`)
                      .join(' • ')}
                  </div>
                </td>

                <td className="right-align table-left-padding">
                  <span className="no-break white-text">Total Picks: {entry.total}</span>
                  <br />
                  <span className="no-break white-text">
                    Peak: {peakPick.phase}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const MostBannedAgents = () => {
  return (
    <div>
      <h2 className="size-two-text">Top 6 Banned Agents</h2>
      <table>
        <tbody>
          {ban_list.slice(0, 6).map((entry, index) => {
            const peakBan = entry.bans.sort((a, b) => b.count - a.count)[0];

            return (
              <tr key={entry.agent}>
                <td>
                  <strong className="highlight-text">
                    {index + 1}. {entry.agent.toUpperCase()}
                  </strong>
                  <div className="gray-text size-three-text">
                    {entry.bans
                      .filter(ban => ban.count !== 0) // exclude bans with count 0 as edge case
                      .slice(0, 6)
                      .map((ban) => `${ban.phase}: ${ban.count}`)
                      .join(' • ')}
                  </div>
                </td>

                <td className="right-align table-left-padding">
                  <span className="no-break white-text">Total Bans: {entry.total}</span>
                  <br />
                  <span className="no-break white-text">
                    Peak: {peakBan.phase}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const MostPickedByTeams = () => {
  return (
    <div>
      <p class="highlight-text size-two-text center-align team-pref-text">Team Preferences</p>
      <p class="size-two-text center-align team-pref-text"><b>Top 5 Picked Agents:</b></p>
      <table>
        <tbody>
          {pick_list.slice(0, 5).map((entry) => {
            const topTeam = agent_team(entry.agent, "PICK", matches)[0];
            return (
              <tr key={entry.agent}>
                <td><span class="white-text size-two-text">{entry.agent.toUpperCase()}</span></td>
                <td class="right-align">
                  <span class="size-two-text highlight-text">{topTeam.team}</span>
                  <div class="gray-text">{topTeam.count} picks</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const MostBannedByTeams = () => {
  return (
    <div>
      <p className="highlight-text size-two-text center-align team-pref-text">Team Preferences</p>
      <p className="size-two-text center-align team-pref-text"><b>Top 5 Banned Agents:</b></p>
      <table>
        <tbody>
          {ban_list.slice(0, 5).map((entry) => {
            const topTeam = agent_team(entry.agent, "BAN", matches)[0];
            return (
              <tr key={entry.agent}>
                <td><span className="white-text size-two-text">{entry.agent.toUpperCase()}</span></td>
                <td className="right-align">
                  <span className="size-two-text highlight-text">{topTeam.team}</span>
                  <div className="gray-text">{topTeam.count} bans</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  // active (if hovering) payload (data associated w/ hover)
  if (active) {
    const { agent, picks, bans } = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#0D0A0B',
        border: '3px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h4 className="white-text">{agent}</h4>
        <p><strong>Picks:</strong> {picks}</p>
        <p><strong>Bans:</strong> {bans}</p>
      </div>
    );
  }

  return null;
};

const AgentPickBanHorizontalChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: '30em' }}>
      <h1>Picks and Bans per Agent <a>(hover for details)</a></h1>
      <ResponsiveContainer>
        <BarChart layout="vertical"
                  data={data}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  barCategoryGap="100%">
          <XAxis type="number" />
          <YAxis type="category" dataKey="agent" angle={-30} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="picks" fill="rgb(0, 255, 255)" />
          <Bar dataKey="bans" fill="rgb(0, 145, 150)" />
        </BarChart>
      </ResponsiveContainer>
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
            <a>{item.agent}: {item.count} picks</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App2 = () => {
  return (
    <div>

      <h1>Mad Science Draft 3 Statistics</h1>
      <div class="grid-line1">
        <div class="grid-item"><MostPickedAgentsSummary /></div>
        <div class="grid-item"><MostBannedAgentsSummary /></div>
        <div class="grid-item"><MostPickedByTeams /></div>
        <div class="grid-item"><MostBannedByTeams /></div>
      </div>

      <div class="grid-line2">
        <div class="grid-item">
          <MostPickedAgents />
        </div>
        <div class="grid-item">
          <MostBannedAgents />
        </div>
      </div>
      
      <div class="grid-item chart">
          <AgentPickBanHorizontalChart data={combinedData} />
        </div>

      <div class="grid-line3">
        <div class="grid-item">
          <h2>Most Picked Agents (Ascent)</h2>
          <DataList data={ascent_picklist} limit={10} />

          <h2>Most Banned Agents (Ascent)</h2>
          <DataList data={ascent_banlist} limit={10} />
        </div>

        <div class="grid-item">
          <h2>Most Picked Agents (Fracture)</h2>
          <DataList data={fracture_picklist} limit={10} />

          <h2>Most Banned Agents (Fracture)</h2>
          <DataList data={fracture_banlist} limit={10} />
        </div>

        <div class="grid-item">
          <h2>Most Picked Agents (Haven)</h2>
          <DataList data={haven_picklist} limit={10} />

          <h2>Most Banned Agents (Haven)</h2>
          <DataList data={haven_banlist} limit={10} />
        </div>

        <div class="grid-item">
          <h2>Most Picked Agents (Icebox)</h2>
          <DataList data={icebox_picklist} limit={10} />

          <h2>Most Banned Agents (Icebox)</h2>
          <DataList data={icebox_banlist} limit={10} />
        </div>

        <div class="grid-item">
          <h2>Most Picked Agents (Lotus)</h2>
          <DataList data={lotus_picklist} limit={10} />

          <h2>Most Banned Agents (Lotus)</h2>
          <DataList data={lotus_banlist} limit={10} />
        </div>

        <div class="grid-item">
          <h2>Most Picked Agents (Pearl)</h2>
          <DataList data={pearl_picklist} limit={10} />

          <h2>Most Banned Agents (Pearl)</h2>
          <DataList data={pearl_banlist} limit={10} />
        </div>

        <div class="grid-item">
          <h2>Most Picked Agents (Split)</h2>
          <DataList data={split_picklist} limit={10} />

          <h2>Most Banned Agents (Split)</h2>
          <DataList data={split_banlist} limit={10} />
        </div>
      </div>

    </div>
  );
};

export default App2;