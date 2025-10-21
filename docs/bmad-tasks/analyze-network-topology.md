# Task: Analyze Network Topology

## Purpose
Parse and analyze network topology data to understand network structure, identify security zones, and map critical assets and data flows.

## Prerequisites
- Network topology file (JSON, XML, or diagram)
- Basic network architecture documentation
- Asset information if available

## Inputs Required
1. **topology_source**: Path to topology file or diagram
2. **analysis_depth**: Quick scan / Standard / Comprehensive
3. **focus_areas**: Security zones / Data flows / Critical assets / All

## Process

### Step 1: Parse Topology Data
- Load topology file (JSON/XML/Visio)
- Extract device information (routers, switches, firewalls, servers, etc.)
- Map network connections and links
- Document network segments and VLANs

### Step 2: Identify Network Zones
- Map trust zones (Corporate, DMZ, OT, Guest, etc.)
- Identify security boundaries
- Document inter-zone connections
- Highlight external-facing systems

### Step 3: Map Critical Assets
- Identify servers and critical infrastructure
- Document SCADA/ICS/OT systems
- Map data stores and databases
- Identify authentication/directory services

### Step 4: Analyze Data Flows
- Trace east-west traffic patterns
- Map north-south (external) connections
- Identify cleartext protocols
- Document backup and management traffic

### Step 5: Security Architecture Assessment
- Evaluate defense-in-depth implementation
- Check network segmentation effectiveness
- Identify single points of failure
- Assess redundancy and resilience

### Step 6: Generate Findings
- Document topology overview
- List security concerns
- Identify quick wins
- Recommend improvements

## Output Format
Generate markdown document with sections:
1. **Executive Summary**
2. **Network Topology Overview**
3. **Network Zones and Segmentation**
4. **Critical Asset Inventory**
5. **Data Flow Analysis**
6. **Security Findings**
7. **Recommendations**
8. **Topology Diagrams** (if applicable)

## Validation Checklist
- [ ] All network segments identified
- [ ] Security zones documented
- [ ] Critical assets cataloged
- [ ] External connections mapped
- [ ] Single points of failure identified
- [ ] Findings are actionable
- [ ] Recommendations prioritized

## Example Output Structure
\`\`\`markdown
# Network Topology Analysis Report

## Executive Summary
- Total devices: XX
- Network segments: XX
- Critical assets identified: XX
- High-priority findings: XX

## Network Topology Overview
[Description of overall network architecture]

## Security Findings
### Critical
1. [Finding with impact and recommendation]

### High
1. [Finding with impact and recommendation]

[Continue with all sections...]
\`\`\`
