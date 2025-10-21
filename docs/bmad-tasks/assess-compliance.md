# Task: Assess Compliance

## Purpose
Evaluate network and system compliance with applicable security standards, regulations, and frameworks.

## Prerequisites
- Completed security assessment
- Knowledge of applicable regulations
- Compliance requirements documentation

## Inputs Required
1. **compliance_frameworks**: LGPD / IEC 62443 / NIST CSF / ISO 27001 / CIS Controls
2. **assessment_scope**: Full compliance / Specific controls / Gap analysis
3. **evidence_collection**: Automated / Manual / Interview-based

## Process

### Step 1: Define Compliance Requirements
- Identify applicable regulations (LGPD, industry-specific)
- Select security frameworks (NIST, ISO, IEC)
- Determine control baseline
- Define audit scope

### Step 2: Data Protection Compliance (LGPD)
- Verify data inventory and classification
- Check consent management
- Assess data subject rights implementation
- Review data processing agreements
- Verify breach notification procedures
- Check Data Protection Officer (DPO) designation

### Step 3: OT/ICS Security (IEC 62443)
- Zone and conduit design
- Network segmentation
- Access control implementation
- Security monitoring
- Incident response capability
- Supply chain security

### Step 4: Cybersecurity Framework (NIST CSF)
- **Identify**: Asset management, risk assessment
- **Protect**: Access control, awareness, data security
- **Detect**: Anomalies, continuous monitoring
- **Respond**: Response planning, communications, analysis
- **Recover**: Recovery planning, improvements, communications

### Step 5: Security Controls (CIS Controls)
- Inventory and control of assets
- Secure configuration
- Data protection
- Access control management
- Continuous vulnerability management
- Audit log management
- Email and web browser protections
- Malware defenses
- Incident response

### Step 6: ISO 27001 Requirements
- Information security policies
- Organization of information security
- Asset management
- Access control
- Cryptography
- Physical and environmental security
- Operations security
- Communications security
- System acquisition, development, and maintenance
- Supplier relationships
- Information security incident management
- Business continuity management
- Compliance

### Step 7: Gap Analysis
- Compare current state vs. requirements
- Document control deficiencies
- Assess severity of gaps
- Prioritize remediation

### Step 8: Evidence Collection
- Collect technical evidence (configs, logs, scans)
- Conduct interviews
- Review policies and procedures
- Validate implementations

## Output Format
Generate markdown document with sections:
1. **Executive Summary**
2. **Compliance Scope**
3. **Framework-Specific Assessment**
4. **Compliance Status Dashboard**
5. **Gap Analysis**
6. **Risk Assessment**
7. **Remediation Roadmap**
8. **Evidence Appendix**

## Compliance Status Levels
- **Compliant**: Control fully implemented and effective
- **Partially Compliant**: Control partially implemented
- **Non-Compliant**: Control not implemented
- **Not Applicable**: Control not relevant to environment

## Validation Checklist
- [ ] All applicable frameworks assessed
- [ ] Control requirements documented
- [ ] Current state evaluated
- [ ] Gaps identified and prioritized
- [ ] Evidence collected
- [ ] Remediation plans defined
- [ ] Timeline established
- [ ] Responsibilities assigned

## Example Output Structure
\`\`\`markdown
# Compliance Assessment Report

## Executive Summary
- Frameworks assessed: LGPD, IEC 62443, NIST CSF
- Overall compliance score: XX%
- Compliant controls: XX
- Partially compliant: XX
- Non-compliant: XX
- Critical gaps: XX

## Compliance Status Dashboard

### LGPD Compliance
| Requirement | Status | Evidence | Gap | Priority |
|-------------|--------|----------|-----|----------|
| Data Inventory | Partially Compliant | Asset inventory exists but incomplete | 30% systems not cataloged | High |
| Consent Management | Non-Compliant | No consent management system | Full implementation needed | Critical |

### IEC 62443 Compliance
| Security Level | Target | Current | Gap |
|----------------|--------|---------|-----|
| SL1: Protection against casual misuse | SL2 | SL1 | Access controls insufficient |

### NIST Cybersecurity Framework
| Function | Implementation | Maturity | Gap |
|----------|----------------|----------|-----|
| Identify | 75% | Tier 2 | Asset management incomplete |
| Protect | 60% | Tier 2 | MFA not implemented |
| Detect | 40% | Tier 1 | SIEM not deployed |
| Respond | 55% | Tier 1 | IR plan not tested |
| Recover | 50% | Tier 1 | DR plan outdated |

## Gap Analysis

### GAP-001: Inadequate Multi-Factor Authentication
- **Framework**: NIST CSF (PR.AC-7), ISO 27001 (A.9.4)
- **Current State**: Password-only authentication
- **Required State**: MFA for all privileged accounts
- **Risk**: High
- **Impact**: Account compromise, unauthorized access
- **Remediation**: Implement MFA solution (Azure AD, Duo, etc.)
- **Timeline**: 90 days
- **Cost Estimate**: $XX,XXX

[Continue with all gaps...]

## Remediation Roadmap

### Phase 1: Critical Gaps (0-90 days)
1. Implement MFA for privileged accounts
2. Deploy SIEM solution
3. Establish incident response procedures
4. Complete data inventory

### Phase 2: High-Priority Gaps (90-180 days)
[...]

\`\`\`
