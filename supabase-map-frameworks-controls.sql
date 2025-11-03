-- ============================================================================
-- Mapeamento de Controles para Frameworks de Compliance
-- Sistema: ness. OT GRC
-- Data: 2025-01-03
-- ============================================================================
-- 
-- Este script mapeia os controles principais de cada framework de segurança
-- aplicável ao setor elétrico (OT - Operational Technology)
--
-- Frameworks incluídos:
-- 1. NIST Cybersecurity Framework (CSF) 2.0
-- 2. ISO/IEC 27001 - Anexo A (14 domínios, 93 controles)
-- 3. ISO/IEC 27002 - Controles detalhados
-- 4. ISO/IEC 27019 - Controles específicos para energia
-- 5. NIST SP 800-82 - Controles para ICS
-- 6. NIST SP 800-53 - Controles de segurança e privacidade
-- 7. IEC 62443 - Controles por zonas e níveis
-- ============================================================================

-- ============================================================================
-- 1. NIST CYBERSECURITY FRAMEWORK (CSF) 2.0
-- ============================================================================

DO $$
DECLARE
    v_nist_csf_id UUID;
BEGIN
    -- Get NIST CSF framework ID
    SELECT id INTO v_nist_csf_id
    FROM compliance.frameworks
    WHERE framework_name = 'NIST Cybersecurity Framework';

    IF v_nist_csf_id IS NULL THEN
        RAISE NOTICE 'NIST CSF framework not found. Please run supabase-insert-frameworks.sql first.';
        RETURN;
    END IF;

    -- GOVERN (GV) - Governança
    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_nist_csf_id, 'GV.OC-1', 'Policies, Processes, and Procedures', 
     'Organizational cybersecurity policies, processes, and procedures are established, communicated, and enforced.',
     'Develop and maintain cybersecurity policies, processes, and procedures that address the organizations cybersecurity risk management strategy.',
     'Foundational',
     '{"function": "Govern", "category": "Organizational Context"}'),
    
    (v_nist_csf_id, 'GV.OC-2', 'Cybersecurity Strategy', 
     'Cybersecurity risk management strategy is established, communicated, and maintained.',
     'Develop and maintain a cybersecurity risk management strategy that addresses how the organization will identify, assess, and manage cybersecurity risks.',
     'Foundational',
     '{"function": "Govern", "category": "Organizational Context"}'),
    
    (v_nist_csf_id, 'GV.RM-1', 'Cybersecurity Risk Management Roles and Responsibilities', 
     'Cybersecurity roles and responsibilities are coordinated and aligned with internal roles and external partners.',
     'Assign cybersecurity roles and responsibilities to internal stakeholders and external partners based on risk management strategy and organizational needs.',
     'Foundational',
     '{"function": "Govern", "category": "Risk Management"}'),

    -- IDENTIFY (ID) - Identificação
    (v_nist_csf_id, 'ID.AM-1', 'Inventory of Assets', 
     'Physical devices and systems within the organization are inventoried.',
     'Identify and document all physical devices and systems within the organization, including hardware, software, and network components.',
     'Foundational',
     '{"function": "Identify", "category": "Asset Management"}'),
    
    (v_nist_csf_id, 'ID.AM-2', 'Software Platforms and Applications', 
     'Software platforms and applications within the organization are inventoried.',
     'Identify and document all software platforms and applications, including commercial, open-source, and custom-developed applications.',
     'Foundational',
     '{"function": "Identify", "category": "Asset Management"}'),
    
    (v_nist_csf_id, 'ID.RA-1', 'Asset Vulnerabilities', 
     'Asset vulnerabilities are identified and documented.',
     'Identify and document vulnerabilities in assets that could be exploited by threat actors.',
     'Foundational',
     '{"function": "Identify", "category": "Risk Assessment"}'),
    
    (v_nist_csf_id, 'ID.RA-2', 'Cyber Threat Intelligence', 
     'Cyber threat intelligence is received, analyzed, and used to enhance security.',
     'Receive, analyze, and use cyber threat intelligence to enhance security posture and inform risk management decisions.',
     'Foundational',
     '{"function": "Identify", "category": "Risk Assessment"}'),

    -- PROTECT (PR) - Proteção
    (v_nist_csf_id, 'PR.AC-1', 'Identities and Credentials', 
     'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users, and processes.',
     'Implement identity and access management controls to manage identities and credentials for devices, users, and processes.',
     'Foundational',
     '{"function": "Protect", "category": "Identity Management and Access Control"}'),
    
    (v_nist_csf_id, 'PR.AC-2', 'Access Permissions and Authorizations', 
     'Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties.',
     'Manage access permissions and authorizations based on the principle of least privilege and separation of duties.',
     'Foundational',
     '{"function": "Protect", "category": "Identity Management and Access Control"}'),
    
    (v_nist_csf_id, 'PR.DS-1', 'Data-at-Rest Protection', 
     'Data-at-rest is protected.',
     'Implement cryptographic controls to protect data-at-rest.',
     'Foundational',
     '{"function": "Protect", "category": "Data Security"}'),
    
    (v_nist_csf_id, 'PR.DS-2', 'Data-in-Transit Protection', 
     'Data-in-transit is protected.',
     'Implement cryptographic controls to protect data-in-transit.',
     'Foundational',
     '{"function": "Protect", "category": "Data Security"}'),
    
    (v_nist_csf_id, 'PR.PS-1', 'Awareness and Training', 
     'Awareness and training programs are established and updated.',
     'Develop and maintain cybersecurity awareness and training programs for all personnel.',
     'Foundational',
     '{"function": "Protect", "category": "Protective Technology"}'),

    -- DETECT (DE) - Detecção
    (v_nist_csf_id, 'DE.AE-1', 'Network and System Monitoring', 
     'Network and system activities are monitored to identify cybersecurity events.',
     'Monitor network and system activities to identify potential cybersecurity events and anomalies.',
     'Foundational',
     '{"function": "Detect", "category": "Anomalies and Events"}'),
    
    (v_nist_csf_id, 'DE.CM-1', 'Network Monitoring', 
     'Network monitoring is performed to identify potential cybersecurity events.',
     'Implement network monitoring capabilities to detect and respond to potential cybersecurity events.',
     'Foundational',
     '{"function": "Detect", "category": "Security Continuous Monitoring"}'),
    
    (v_nist_csf_id, 'DE.CM-2', 'Vulnerability Monitoring', 
     'Vulnerability monitoring is performed to identify potential cybersecurity events.',
     'Implement vulnerability monitoring capabilities to identify and assess vulnerabilities in systems and applications.',
     'Foundational',
     '{"function": "Detect", "category": "Security Continuous Monitoring"}'),

    -- RESPOND (RS) - Resposta
    (v_nist_csf_id, 'RS.RP-1', 'Response Plan Execution', 
     'Response plans are executed during or after a cybersecurity incident.',
     'Execute response plans during or after a cybersecurity incident to contain and mitigate the impact.',
     'Foundational',
     '{"function": "Respond", "category": "Response Planning"}'),
    
    (v_nist_csf_id, 'RS.CO-1', 'Incident Coordination', 
     'Incident response activities are coordinated with internal and external stakeholders.',
     'Coordinate incident response activities with internal stakeholders and external partners.',
     'Foundational',
     '{"function": "Respond", "category": "Communications"}'),

    -- RECOVER (RC) - Recuperação
    (v_nist_csf_id, 'RC.RP-1', 'Recovery Plan Execution', 
     'Recovery plans are executed during or after a cybersecurity incident.',
     'Execute recovery plans during or after a cybersecurity incident to restore systems and operations.',
     'Foundational',
     '{"function": "Recover", "category": "Recovery Planning"}'),
    
    (v_nist_csf_id, 'RC.IM-1', 'Recovery Improvements', 
     'Recovery planning and processes are improved by incorporating lessons learned.',
     'Improve recovery planning and processes by incorporating lessons learned from incidents and exercises.',
     'Foundational',
     '{"function": "Recover", "category": "Improvements"}')
    
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted NIST CSF 2.0 controls';
END $$;

-- ============================================================================
-- 2. ISO/IEC 27001 - Anexo A (14 Domínios Principais)
-- ============================================================================

DO $$
DECLARE
    v_iso27001_id UUID;
BEGIN
    SELECT id INTO v_iso27001_id
    FROM compliance.frameworks
    WHERE framework_name = 'ISO/IEC 27001';

    IF v_iso27001_id IS NULL THEN
        RAISE NOTICE 'ISO/IEC 27001 framework not found.';
        RETURN;
    END IF;

    -- A.5 - Políticas de Segurança da Informação
    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_iso27001_id, 'A.5.1.1', 'Policies for Information Security', 
     'A set of policies for information security shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel, and reviewed at planned intervals.',
     'Establish, document, approve, and review information security policies that are aligned with the organizations business objectives and regulatory requirements.',
     'Foundational',
     '{"domain": "A.5", "domain_name": "Policies for Information Security", "annex_a": true}'),
    
    (v_iso27001_id, 'A.5.1.2', 'Review of Policies for Information Security', 
     'The policies for information security shall be reviewed at planned intervals or if significant changes occur.',
     'Review and update information security policies at planned intervals or when significant changes occur to ensure continued suitability, adequacy, and effectiveness.',
     'Foundational',
     '{"domain": "A.5", "domain_name": "Policies for Information Security", "annex_a": true}'),

    -- A.6 - Organização da Segurança da Informação
    (v_iso27001_id, 'A.6.1.1', 'Information Security Roles and Responsibilities', 
     'All information security responsibilities shall be defined and allocated.',
     'Define and allocate information security roles and responsibilities to ensure accountability and effective management of information security.',
     'Foundational',
     '{"domain": "A.6", "domain_name": "Organization of Information Security", "annex_a": true}'),
    
    (v_iso27001_id, 'A.6.1.2', 'Segregation of Duties', 
     'Conflicting duties and areas of responsibility shall be segregated.',
     'Implement segregation of duties to reduce the risk of unauthorized or unintentional modification or misuse of information assets.',
     'Foundational',
     '{"domain": "A.6", "domain_name": "Organization of Information Security", "annex_a": true}'),

    -- A.7 - Segurança de Recursos Humanos
    (v_iso27001_id, 'A.7.1.1', 'Screening', 
     'Background verification checks on all candidates for employment shall be carried out.',
     'Carry out background verification checks on all candidates for employment to ensure they meet security requirements.',
     'Foundational',
     '{"domain": "A.7", "domain_name": "Human Resource Security", "annex_a": true}'),
    
    (v_iso27001_id, 'A.7.2.1', 'Terms and Conditions of Employment', 
     'Terms and conditions of employment shall state the information security responsibilities of employees.',
     'Include information security responsibilities in terms and conditions of employment to ensure employees understand their obligations.',
     'Foundational',
     '{"domain": "A.7", "domain_name": "Human Resource Security", "annex_a": true}'),

    -- A.8 - Gestão de Ativos
    (v_iso27001_id, 'A.8.1.1', 'Inventory of Assets', 
     'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.',
     'Identify and maintain an inventory of assets associated with information and information processing facilities.',
     'Foundational',
     '{"domain": "A.8", "domain_name": "Asset Management", "annex_a": true}'),
    
    (v_iso27001_id, 'A.8.2.1', 'Classification of Information', 
     'Information shall be classified according to legal requirements, value, criticality, and sensitivity to unauthorized disclosure or modification.',
     'Classify information according to legal requirements, value, criticality, and sensitivity to ensure appropriate protection.',
     'Foundational',
     '{"domain": "A.8", "domain_name": "Asset Management", "annex_a": true}'),

    -- A.9 - Controles de Acesso
    (v_iso27001_id, 'A.9.1.1', 'Access Control Policy', 
     'An access control policy shall be established, documented, and reviewed.',
     'Establish, document, and review an access control policy that defines rules for access to information systems and services.',
     'Foundational',
     '{"domain": "A.9", "domain_name": "Access Control", "annex_a": true}'),
    
    (v_iso27001_id, 'A.9.2.1', 'User Registration and De-registration', 
     'A formal user registration and de-registration process shall be implemented to enable assignment of access rights.',
     'Implement a formal process for user registration and de-registration to manage access rights throughout the user lifecycle.',
     'Foundational',
     '{"domain": "A.9", "domain_name": "Access Control", "annex_a": true}'),
    
    (v_iso27001_id, 'A.9.4.2', 'Secure Log-on Procedures', 
     'Where required by the access control policy, access to systems and applications shall be controlled by secure log-on procedures.',
     'Implement secure log-on procedures to control access to systems and applications.',
     'Foundational',
     '{"domain": "A.9", "domain_name": "Access Control", "annex_a": true}'),
    
    (v_iso27001_id, 'A.9.4.4', 'Use of Privileged Utility Programs', 
     'The allocation and use of privileged utility programs shall be restricted and controlled.',
     'Restrict and control the allocation and use of privileged utility programs to prevent unauthorized access to system functions.',
     'Foundational',
     '{"domain": "A.9", "domain_name": "Access Control", "annex_a": true}'),

    -- A.10 - Criptografia
    (v_iso27001_id, 'A.10.1.1', 'Cryptographic Controls', 
     'A policy on the use of cryptographic controls shall be developed and implemented.',
     'Develop and implement a policy on the use of cryptographic controls to protect information confidentiality, integrity, and authenticity.',
     'Foundational',
     '{"domain": "A.10", "domain_name": "Cryptography", "annex_a": true}'),

    -- A.12 - Segurança Operacional
    (v_iso27001_id, 'A.12.1.1', 'Documented Operating Procedures', 
     'Operating procedures shall be documented and made available to all users who need them.',
     'Document operating procedures and make them available to all users who need them to ensure consistent and secure operations.',
     'Foundational',
     '{"domain": "A.12", "domain_name": "Operations Security", "annex_a": true}'),
    
    (v_iso27001_id, 'A.12.2.1', 'Controls Against Malware', 
     'Detection, prevention, and recovery controls to protect against malware shall be implemented.',
     'Implement detection, prevention, and recovery controls to protect against malware.',
     'Foundational',
     '{"domain": "A.12", "domain_name": "Operations Security", "annex_a": true}'),
    
    (v_iso27001_id, 'A.12.4.1', 'Event Logging', 
     'Event logs recording user activities, exceptions, faults, and information security events shall be produced, kept, and regularly reviewed.',
     'Produce, keep, and regularly review event logs to monitor and detect security events.',
     'Foundational',
     '{"domain": "A.12", "domain_name": "Operations Security", "annex_a": true}'),
    
    (v_iso27001_id, 'A.12.6.1', 'Management of Technical Vulnerabilities', 
     'Information about technical vulnerabilities of information systems shall be obtained, evaluated, and appropriate measures taken.',
     'Obtain information about technical vulnerabilities, evaluate them, and take appropriate measures to address them.',
     'Foundational',
     '{"domain": "A.12", "domain_name": "Operations Security", "annex_a": true}'),

    -- A.14 - Segurança de Sistemas
    (v_iso27001_id, 'A.14.1.1', 'Information Security Requirements Analysis and Specification', 
     'The information security requirements shall be analyzed and specified.',
     'Analyze and specify information security requirements for new information systems or changes to existing systems.',
     'Foundational',
     '{"domain": "A.14", "domain_name": "System Acquisition, Development, and Maintenance", "annex_a": true}'),
    
    (v_iso27001_id, 'A.14.2.1', 'Secure Development Policy', 
     'Rules for the development of software and systems shall be established and applied.',
     'Establish and apply rules for secure development of software and systems.',
     'Foundational',
     '{"domain": "A.14", "domain_name": "System Acquisition, Development, and Maintenance", "annex_a": true}'),

    -- A.17 - Continuidade de Negócio
    (v_iso27001_id, 'A.17.1.1', 'Planning Information Security Continuity', 
     'Information security continuity shall be embedded in the business continuity management system.',
     'Embed information security continuity in the business continuity management system.',
     'Foundational',
     '{"domain": "A.17", "domain_name": "Business Continuity Management", "annex_a": true}'),

    -- A.18 - Conformidade
    (v_iso27001_id, 'A.18.1.1', 'Identification of Applicable Legislation and Contractual Requirements', 
     'All relevant statutory, regulatory, and contractual requirements and the organizations approach to meet these requirements shall be identified, documented, and kept up to date.',
     'Identify, document, and keep up to date all relevant statutory, regulatory, and contractual requirements.',
     'Foundational',
     '{"domain": "A.18", "domain_name": "Compliance", "annex_a": true}')
    
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted ISO/IEC 27001 controls';
END $$;

-- ============================================================================
-- 3. ISO/IEC 27019 - Controles Específicos para Energia
-- ============================================================================

DO $$
DECLARE
    v_iso27019_id UUID;
BEGIN
    SELECT id INTO v_iso27019_id
    FROM compliance.frameworks
    WHERE framework_name = 'ISO/IEC 27019';

    IF v_iso27019_id IS NULL THEN
        RAISE NOTICE 'ISO/IEC 27019 framework not found.';
        RETURN;
    END IF;

    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_iso27019_id, 'A.12.6.2', 'Management of Technical Vulnerabilities in Process Control and SCADA Systems', 
     'Information about technical vulnerabilities of process control and SCADA systems shall be obtained, evaluated, and appropriate measures taken.',
     'Obtain, evaluate, and address technical vulnerabilities in process control and SCADA systems specific to energy sector operations.',
     'Foundational',
     '{"domain": "A.12", "domain_name": "Operations Security", "energy_specific": true, "scada": true}'),
    
    (v_iso27019_id, 'A.12.7.1', 'Backup for Process Control and SCADA Systems', 
     'Backup copies of information, software, and system images for process control and SCADA systems shall be taken regularly and tested.',
     'Take and test backup copies of information, software, and system images for process control and SCADA systems regularly.',
     'Foundational',
     '{"domain": "A.12", "domain_name": "Operations Security", "energy_specific": true, "scada": true}'),
    
    (v_iso27019_id, 'A.13.1.1', 'Network Controls for Process Control and SCADA Systems', 
     'Network controls shall be implemented to protect process control and SCADA systems.',
     'Implement network controls to protect process control and SCADA systems from unauthorized access and attacks.',
     'Foundational',
     '{"domain": "A.13", "domain_name": "Communications Security", "energy_specific": true, "scada": true}'),
    
    (v_iso27019_id, 'A.13.2.1', 'Security of Network Services for Process Control and SCADA Systems', 
     'Security requirements, service levels, and service management requirements shall be identified and included in network service agreements for process control and SCADA systems.',
     'Include security requirements in network service agreements for process control and SCADA systems.',
     'Foundational',
     '{"domain": "A.13", "domain_name": "Communications Security", "energy_specific": true, "scada": true}')
    
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted ISO/IEC 27019 controls';
END $$;

-- ============================================================================
-- 4. NIST SP 800-82 - Controles para ICS (Industrial Control Systems)
-- ============================================================================

DO $$
DECLARE
    v_nist80082_id UUID;
BEGIN
    SELECT id INTO v_nist80082_id
    FROM compliance.frameworks
    WHERE framework_name = 'NIST SP 800-82';

    IF v_nist80082_id IS NULL THEN
        RAISE NOTICE 'NIST SP 800-82 framework not found.';
        RETURN;
    END IF;

    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_nist80082_id, 'ICS-1', 'ICS Security Architecture', 
     'Develop and maintain an ICS security architecture that addresses defense-in-depth strategies.',
     'Implement a layered security architecture for ICS that includes network segmentation, access controls, and monitoring.',
     'Foundational',
     '{"ics_specific": true, "category": "Architecture"}'),
    
    (v_nist80082_id, 'ICS-2', 'Network Segmentation', 
     'Implement network segmentation to isolate ICS networks from corporate networks and the internet.',
     'Use firewalls, demilitarized zones (DMZ), and network segmentation to isolate ICS networks.',
     'Foundational',
     '{"ics_specific": true, "category": "Network Security"}'),
    
    (v_nist80082_id, 'ICS-3', 'Access Control for ICS', 
     'Implement access controls to restrict access to ICS systems and networks.',
     'Implement authentication, authorization, and accounting (AAA) controls for ICS access.',
     'Foundational',
     '{"ics_specific": true, "category": "Access Control"}'),
    
    (v_nist80082_id, 'ICS-4', 'Patch Management for ICS', 
     'Implement a patch management process for ICS systems that addresses security vulnerabilities while maintaining system availability.',
     'Develop and implement a patch management process that balances security and availability for ICS systems.',
     'Foundational',
     '{"ics_specific": true, "category": "System Maintenance"}'),
    
    (v_nist80082_id, 'ICS-5', 'Monitoring and Detection', 
     'Implement monitoring and detection capabilities for ICS networks and systems.',
     'Deploy security monitoring tools and establish processes to detect and respond to security events in ICS environments.',
     'Foundational',
     '{"ics_specific": true, "category": "Monitoring"}')
    
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted NIST SP 800-82 controls';
END $$;

-- ============================================================================
-- 5. NIST SP 800-53 - Controles Principais (Sample)
-- ============================================================================

DO $$
DECLARE
    v_nist80053_id UUID;
BEGIN
    SELECT id INTO v_nist80053_id
    FROM compliance.frameworks
    WHERE framework_name = 'NIST SP 800-53';

    IF v_nist80053_id IS NULL THEN
        RAISE NOTICE 'NIST SP 800-53 framework not found.';
        RETURN;
    END IF;

    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_nist80053_id, 'AC-2', 'Account Management', 
     'The organization manages information system accounts, including establishing, activating, modifying, disabling, and removing accounts.',
     'Establish and maintain an account management process for information system accounts.',
     'Foundational',
     '{"control_family": "AC", "family_name": "Access Control"}'),
    
    (v_nist80053_id, 'AC-3', 'Access Enforcement', 
     'The information system enforces approved authorizations for logical access to information and system resources.',
     'Implement access enforcement mechanisms to ensure only authorized access is permitted.',
     'Foundational',
     '{"control_family": "AC", "family_name": "Access Control"}'),
    
    (v_nist80053_id, 'SI-2', 'Flaw Remediation', 
     'The organization identifies, reports, and corrects information system flaws.',
     'Implement a flaw remediation process to identify, report, and correct information system vulnerabilities.',
     'Foundational',
     '{"control_family": "SI", "family_name": "System and Information Integrity"}'),
    
    (v_nist80053_id, 'SI-4', 'Information System Monitoring', 
     'The organization monitors the information system to detect attacks and indicators of potential attacks.',
     'Implement continuous monitoring capabilities to detect attacks and indicators of potential attacks.',
     'Foundational',
     '{"control_family": "SI", "family_name": "System and Information Integrity"}')
    
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted NIST SP 800-53 controls';
END $$;

-- ============================================================================
-- 6. IEC 62443 - Controles por Zonas e Níveis
-- ============================================================================

DO $$
DECLARE
    v_iec62443_id UUID;
BEGIN
    SELECT id INTO v_iec62443_id
    FROM compliance.frameworks
    WHERE framework_name = 'IEC 62443';

    IF v_iec62443_id IS NULL THEN
        RAISE NOTICE 'IEC 62443 framework not found.';
        RETURN;
    END IF;

    INSERT INTO compliance.controls (framework_id, control_code, control_title, description, requirement_text, level, metadata)
    VALUES
    (v_iec62443_id, 'FR-1', 'Foundation Requirements', 
     'Implement foundation requirements for industrial automation and control system security.',
     'Establish foundation requirements as the basis for all security requirements in industrial automation and control systems.',
     'Foundational',
     '{"iec_category": "FR", "category_name": "Foundation Requirements"}'),
    
    (v_iec62443_id, 'SR-1.1', 'Identification and Authentication Control', 
     'The control system shall provide identification and authentication capabilities.',
     'Implement identification and authentication controls for users, devices, and software in control systems.',
     'Level 1',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 1}'),
    
    (v_iec62443_id, 'SR-1.2', 'Use Control', 
     'The control system shall provide use control capabilities.',
     'Implement use control mechanisms to restrict access to control system functions and data.',
     'Level 1',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 1}'),
    
    (v_iec62443_id, 'SR-2.1', 'Software and Information Integrity', 
     'The control system shall provide software and information integrity capabilities.',
     'Implement integrity controls to protect software and information from unauthorized modification.',
     'Level 2',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 2}'),
    
    (v_iec62443_id, 'SR-3.1', 'Data Confidentiality', 
     'The control system shall provide data confidentiality capabilities.',
     'Implement confidentiality controls to protect data from unauthorized disclosure.',
     'Level 2',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 2}'),
    
    (v_iec62443_id, 'SR-4.1', 'Restricted Data Flow', 
     'The control system shall provide restricted data flow capabilities.',
     'Implement network segmentation and data flow controls to restrict communications between zones.',
     'Level 3',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 3, "zone_focus": true}'),
    
    (v_iec62443_id, 'SR-5.1', 'Network Segmentation', 
     'The control system shall provide network segmentation capabilities.',
     'Implement network segmentation to isolate zones and conduits in industrial control systems.',
     'Level 3',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 3, "zone_focus": true}'),
    
    (v_iec62443_id, 'SR-6.1', 'Audit Logging', 
     'The control system shall provide audit logging capabilities.',
     'Implement audit logging to record security-relevant events for monitoring and forensic analysis.',
     'Level 2',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 2}'),
    
    (v_iec62443_id, 'SR-7.1', 'Denial of Service Protection', 
     'The control system shall provide denial of service protection capabilities.',
     'Implement controls to protect against denial of service attacks that could impact control system availability.',
     'Level 2',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 2}'),
    
    (v_iec62443_id, 'SR-8.1', 'System Backup and Recovery', 
     'The control system shall provide system backup and recovery capabilities.',
     'Implement backup and recovery procedures to restore control system operations after failures or incidents.',
     'Level 1',
     '{"iec_category": "SR", "category_name": "System Requirements", "security_level": 1}')
    
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Inserted IEC 62443 controls';
END $$;

-- ============================================================================
-- Verificação Final
-- ============================================================================

-- Contar controles inseridos por framework
DO $$
BEGIN
    RAISE NOTICE 'Framework controls mapping completed!';
    RAISE NOTICE 'Verificando controles inseridos...';
END $$;

-- Query para verificar controles por framework
SELECT 
    f.framework_name,
    f.version,
    COUNT(c.id) as total_controls
FROM compliance.frameworks f
LEFT JOIN compliance.controls c ON c.framework_id = f.id
WHERE f.framework_name IN (
    'NIST Cybersecurity Framework',
    'ISO/IEC 27001',
    'ISO/IEC 27019',
    'NIST SP 800-82',
    'NIST SP 800-53',
    'IEC 62443'
)
GROUP BY f.id, f.framework_name, f.version
ORDER BY f.framework_name;
