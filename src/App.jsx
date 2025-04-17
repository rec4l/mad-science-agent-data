import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import matches from './data/data.json'

// started by manipulating data, first i know my strength is manipulating data 
// i just have to get the correct data in the right variables so i can do work with it
// planned what info i need such as top agents so i knew one part was to count agents by map


// function to return number of things based on certain criteria
// top 6 agents banned and picked, and for each agent note how many picks and bans of each level it has

// sort by team and know how to see what they banned the most

// ideas for optional features: 

// learn how to graph each agent by bans and picks

function count_agent_map_action(agent, action, matches) {
  let agent_count = new Array(16).fill(0);

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

  if (action == "PICK") {
    phaseCountPairs.forEach(item => {
      if (item.phase == 0) { 
        item.phase = '1st Pick'
      } else if (item.phase == 1) {
        item.phase = '2nd Pick'
      } else if (item.phase == 6) {
        item.phase = '3rd Pick'
      } else if (item.phase == 7) {
        item.phase = '4th Pick'
      } else if (item.phase == 8) {
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
      } else if (item.phase == 4) {
        item.phase = '3rd Ban'
      } else if (item.phase == 5) {
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
  // { "Mad Science": 3, "fucku4": 5, … }
  const teamCounts = {};

  matches.forEach(match => {
    const { team_a, team_b, state } = match.draft_data;

    // state is an array of “maps”, each with an array of phase objects
    state.forEach(mapPhases => {
      mapPhases.forEach(phase => {
        if (phase.agent === agent && phase.action === action) {
          // phase.team is "A" or "B"
          const teamName = phase.team === "A" ? team_a : team_b;
          teamCounts[teamName] = (teamCounts[teamName] || 0) + 1;
        }
      });
    });
  });

  // Convert to [{ team, count }, …] and sort descending by count
  return Object
    .entries(teamCounts)
    .map(([team, count]) => ({ team, count }))
    .sort((a, b) => b.count - a.count);
}


console.log(agent_team("Tejo", "BAN", matches))

function total_in_array(array) {
  let sum = 0
  array.forEach(value =>{
    sum += value.count
  })
  return sum
}


const agents = ['Brimstone', 'Omen', 'Viper', 'Raze', 'Cypher',
                'Sage', 'Sova', 'Phoenix', 'Jett', 'Breach',
                'Reyna', 'Killjoy', 'Skye', 'Yoru', 'Astra',
                'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor',
                'Gekko', 'Deadlock', 'Iso', 'Clove', 'Vyse',
                'Tejo', 'Waylay']

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

pick_list.sort((a, b) => b.total - a.total)
ban_list.sort((a, b) => b.total - a.total)


const combinedData = pick_list.map(pick => {
  const ban = ban_list.find(b => b.agent === pick.agent);
  return {
    agent: pick.agent,
    picks: pick.total,
    bans: ban ? ban.total : 0
  };
});


const MostPickedAgentsSummary = () => {
  return (
    <div>
      <h2>Most Picked Agent</h2>
      <ul>
        {pick_list.slice(0, 1).map((entry, index) => (
          <li key={index}>
            <strong>{entry.agent}</strong> — Total Picks: {entry.total}
            <br></br>
            <ul>
              {entry.picks.slice(0,1).map((pick, phaseIndex) => (
                <li key={phaseIndex}>{pick.phase}: {pick.count}</li>
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
        {ban_list.slice(0, 1).map((entry, index) => (
          <li key={index}>
            <strong>{entry.agent}</strong> — Total Bans: {entry.total}
            <br></br>
            <ul>
              {entry.bans.slice(0,1).map((pick, phaseIndex) => (
                <li key={phaseIndex}>{pick.phase}: {pick.count}</li>
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
        {pick_list.slice(0, 6).map((entry, index) => (
          <li key={index}>
            <strong>{entry.agent}</strong> — Total Picks: {entry.total}
            <br></br>
            <strong>Picks</strong>
            <ul>
              {entry.picks.slice(0,10).map((pick, phaseIndex) => (
                <li key={phaseIndex}>{pick.phase}: {pick.count}</li>
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
        {ban_list.slice(0, 6).map((entry, index) => (
          <li key={index}>
            <strong>{entry.agent}</strong> — Total Bans: {entry.total}
            <br></br>
            <strong>Bans</strong>
            <ul>
              {entry.bans.slice(0,6).map((pick, phaseIndex) => (
                <li key={phaseIndex}>{pick.phase}: {pick.count}</li>
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
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 100, bottom: 500 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="agent" />
          <Tooltip />
          <Legend />
          <Bar dataKey="picks" fill="#8884d8" />
          <Bar dataKey="bans" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

agent_team(pick_list[0].agent, "PICK", matches)[0] // team most picked 1st picked agent
agent_team(pick_list[1].agent, "PICK", matches)[0]
agent_team(pick_list[2].agent, "PICK", matches)[0]
agent_team(pick_list[3].agent, "PICK", matches)[0]
console.log(agent_team(pick_list[4].agent, "PICK", matches))
console.log(agent_team(pick_list[5].agent, "PICK", matches))
console.log(agent_team(pick_list[6].agent, "PICK", matches))

const MostPickedByTeams = () => {
  return (
    <div>
      <h2>Top 6 Picked Agents, by Team</h2>
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
      <h2>Top 6 Banned Agents, by Team</h2>
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

const App = () => {
  return (
    <div>
      <h1>Agent Stats</h1>
      <MostBannedByTeams />
      <MostPickedByTeams />
      <MostPickedAgentsSummary />
      <MostBannedAgentsSummary />

      <MostPickedAgents />
      <MostBannedAgents />

      <AgentPickBanHorizontalChart data={combinedData} />


    </div>
  );
};



export default App;