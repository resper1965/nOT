# Task: Scan Vulnerabilities

## Purpose
Identify security vulnerabilities, misconfigurations, and weaknesses across network infrastructure and systems.

## Prerequisites
- Asset inventory completed
- Network access for scanning
- Authorization for security testing

## Inputs Required
1. **target_scope**: IP ranges, hostnames, or asset list
2. **scan_type**: Network scan / Service scan / Vulnerability scan / Full audit
3. **scan_intensity**: Passive / Non-intrusive / Comprehensive / Aggressive
4. **compliance_framework**: NIST / CIS / IEC 62443 / ISO 27001

## Process

### Step 1: Network Discovery
- Identify live hosts
- Map open ports and services
- Detect operating systems
- Identify network devices vs. endpoints

### Step 2: Service Enumeration
- Enumerate running services
- Identify service versions
- Detect web servers and applications
- Map database services
- Identify industrial protocols (Modbus, DNP3, etc.)

### Step 3: Vulnerability Scanning
- Scan for known CVEs
- Check for missing security patches
- Identify end-of-life software
- Detect default configurations
- Check for weak SSL/TLS implementations

### Step 4: Configuration Assessment
- Check for default credentials
- Verify password policies
- Assess authentication mechanisms
- Review authorization controls
- Check encryption settings

### Step 5: Compliance Verification
- Verify against compliance baseline
- Check CIS Benchmarks
- Validate security hardening
- Assess logging and monitoring
- Review backup configurations

### Step 6: Prioritize Findings
- Calculate CVSS scores
- Assess exploitability
- Consider threat intelligence
- Factor in asset criticality
- Account for compensating controls

## Output Format
Generate markdown document with sections:
1. **Executive Summary**
2. **Scan Methodology**
3. **Asset Summary**
4. **Critical Vulnerabilities**
5. **High-Risk Findings**
6. **Medium/Low Findings**
7. **Compliance Gaps**
8. **Remediation Priorities**
9. **Detailed Findings Appendix**

## Vulnerability Severity Classification
- **Critical**: CVSS 9.0-10.0, Active exploitation, No workaround
- **High**: CVSS 7.0-8.9, High impact, Exploit available
- **Medium**: CVSS 4.0-6.9, Moderate impact, Authentication required
- **Low**: CVSS 0.1-3.9, Low impact, Complex exploitation

## Validation Checklist
- [ ] All in-scope assets scanned
- [ ] Scan results validated (no false positives where possible)
- [ ] CVE information researched
- [ ] CVSS scores documented
- [ ] Exploitability assessed
- [ ] Business impact evaluated
- [ ] Remediation guidance provided
- [ ] Findings prioritized

## Example Output Structure
\`\`\`markdown
# Vulnerability Assessment Report

## Executive Summary
- Assets scanned: XX
- Total vulnerabilities: XX
- Critical: XX | High: XX | Medium: XX | Low: XX
- Average CVSS score: X.X
- Recommended remediation timeline: XX days

## Critical Vulnerabilities

### VULN-001: Outdated Windows Server with Remote Code Execution Vulnerability
- **Asset**: SRV-DC-01 (Domain Controller)
- **CVE**: CVE-2023-XXXXX
- **CVSS Score**: 9.8 (Critical)
- **Description**: Remote code execution vulnerability in unpatched Windows Server
- **Exploit Available**: Yes (Public exploit code available)
- **Business Impact**: Complete domain compromise, lateral movement to all systems
- **Affected Systems**: 1
- **Recommendation**: Apply security patch KB5034567 immediately
- **Remediation Effort**: 2 hours
- **Priority**: P0 (Immediate)

[Continue with all critical and high vulnerabilities...]

## Compliance Assessment
| Control | Requirement | Status | Gap |
|---------|-------------|--------|-----|
| CIS 1.1 | Inventory of assets | ✓ Pass | - |
| CIS 2.3 | Patch management | ✗ Fail | 45% systems not patched |

\`\`\`
