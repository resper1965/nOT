# Task: Detect Data Leakage Paths

## Purpose
Identify potential data exfiltration vectors, unencrypted data transmission, and insider threat opportunities within the network infrastructure.

## Prerequisites
- Network topology analysis completed
- Asset inventory available
- Understanding of data classification

## Inputs Required
1. **network_topology**: Completed topology analysis
2. **data_sensitivity**: Classification of sensitive data
3. **scope**: Full network / Specific segment / Critical assets only

## Process

### Step 1: Identify Sensitive Data Locations
- Database servers and file servers
- Application servers with PII/sensitive data
- Backup systems
- Email and collaboration platforms
- Cloud storage connections

### Step 2: Analyze Egress Points
- Internet gateways and proxies
- VPN endpoints
- Cloud service connections
- Email gateways
- FTP/SFTP servers
- Third-party connections

### Step 3: Check Data Transmission Security
- Identify unencrypted protocols (HTTP, FTP, Telnet, SMB v1)
- Verify TLS/SSL implementation
- Check database connection encryption
- Assess VPN encryption strength
- Review wireless security

### Step 4: Evaluate Data Loss Prevention (DLP) Controls
- Check for DLP solutions
- Review egress filtering rules
- Assess email content inspection
- Evaluate USB/removable media controls
- Check print/screen capture restrictions

### Step 5: Assess Insider Threat Vectors
- Review privileged user access
- Check database administrator controls
- Evaluate backup operator access
- Assess developer/IT admin permissions
- Review audit logging coverage

### Step 6: Identify Shadow IT Risks
- Unauthorized cloud storage (Dropbox, Google Drive)
- Personal email usage
- Unauthorized remote access tools
- Rogue wireless access points
- Unauthorized applications

### Step 7: Analyze Access Path Complexity
- Map least-privilege violations
- Identify over-permissioned accounts
- Check for direct database access
- Review service account usage
- Assess shared credential usage

## Output Format
Generate markdown document with sections:
1. **Executive Summary**
2. **Sensitive Data Inventory**
3. **Egress Points Analysis**
4. **Unencrypted Data Transmission**
5. **DLP Control Assessment**
6. **Insider Threat Vectors**
7. **Shadow IT Risks**
8. **Risk Prioritization**
9. **Remediation Recommendations**

## Risk Scoring
For each data leakage path, assess:
- **Likelihood**: How easy is it to exploit?
- **Impact**: What data could be exfiltrated?
- **Detectability**: Would it be noticed?
- **Risk Level**: Critical / High / Medium / Low

## Validation Checklist
- [ ] All sensitive data locations identified
- [ ] Egress points cataloged
- [ ] Unencrypted protocols documented
- [ ] DLP controls assessed
- [ ] Insider threat vectors analyzed
- [ ] Shadow IT risks evaluated
- [ ] Risks prioritized by severity
- [ ] Recommendations are actionable

## Example Output Structure
\`\`\`markdown
# Data Leakage Analysis Report

## Executive Summary
- Data leakage paths identified: XX
- Critical risks: XX
- Unencrypted data flows: XX
- DLP coverage: XX%

## Sensitive Data Inventory
| Data Type | Location | Classification | Volume | Risk |
|-----------|----------|----------------|--------|------|
| Customer PII | SQL-DB-01 | Confidential | High | Critical |

## Data Leakage Paths

### DL-001: Unencrypted Database Connections
- **Severity**: Critical
- **Description**: Application servers connect to databases without encryption
- **Impact**: Database credentials and sensitive data exposed to network sniffing
- **Likelihood**: High
- **Recommendation**: Enable TLS on all database connections
- **Priority**: 1

[Continue with all findings...]
\`\`\`
