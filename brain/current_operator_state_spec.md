# Megan HQ Current Operator State

Purpose:
- keep the latest portable operator state outside any single thread
- let the shell resume instantly
- let ChatGPT runtime load the same latest state via shared memory tooling

Primary files:
- brain/runtime_sessions/current_operator_state.json
- brain/runtime_sessions/latest_session_summary.json
- brain/runtime_sessions/{sessionId}.json

Behavior:
- every user turn is appended
- every assistant turn is appended
- current_operator_state.json is rewritten after every assistant response
- latest_session_summary.json is refreshed after every assistant response
- /hq/state returns the latest operator state for shell boot or handoff loading
