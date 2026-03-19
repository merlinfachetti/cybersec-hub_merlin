-- Seed: Providers
INSERT INTO providers (id, name, slug, website, description, country, "createdAt", "updatedAt") VALUES
('prov_comptia', 'CompTIA', 'comptia', 'https://www.comptia.org', 'Leading provider of vendor-neutral IT certifications', 'US', NOW(), NOW()),
('prov_ec_council', 'EC-Council', 'ec-council', 'https://www.eccouncil.org', 'World''s largest cybersecurity technical certification body', 'US', NOW(), NOW()),
('prov_isc2', '(ISC)²', 'isc2', 'https://www.isc2.org', 'Leading cybersecurity professional organization', 'US', NOW(), NOW()),
('prov_offensive', 'Offensive Security', 'offensive-security', 'https://www.offensive-security.com', 'Provider of hands-on offensive security training', 'US', NOW(), NOW()),
('prov_sans', 'SANS Institute', 'sans', 'https://www.sans.org', 'Premier cybersecurity training and certification organization', 'US', NOW(), NOW()),
('prov_isaca', 'ISACA', 'isaca', 'https://www.isaca.org', 'Global IT governance, audit, risk and security association', 'US', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed: Certifications
INSERT INTO certifications (id, slug, name, "fullName", acronym, "providerId", level, category, description, objectives, "targetAudience", "recommendedExperience", "examFormat", "examDuration", "numberOfQuestions", "passingScore", "officialUrl", "validityYears", "requiresRenewal", "lastUpdated", "updatedAt") VALUES

('cert_sec_plus', 'comptia-security-plus', 'Security+', 'CompTIA Security+ SY0-701', 'SEC+', 'prov_comptia', 'ENTRY', 'DEFENSIVE_SECURITY',
'Baseline cybersecurity certification covering threats, attacks, network security, cryptography and identity management.',
ARRAY['Threats, Attacks and Vulnerabilities', 'Architecture and Design', 'Implementation', 'Operations and Incident Response', 'Governance, Risk and Compliance'],
'IT professionals transitioning to cybersecurity, network admins, system admins',
'2+ years IT experience recommended',
'Multiple choice and performance-based', 90, 90, 750,
'https://www.comptia.org/certifications/security', 3, true, NOW(), NOW()),

('cert_ceh', 'ceh-certified-ethical-hacker', 'CEH', 'Certified Ethical Hacker v12', 'CEH', 'prov_ec_council', 'INTERMEDIATE', 'OFFENSIVE_SECURITY',
'Master ethical hacking methodology and tools. Learn to think like a hacker to defend against attacks.',
ARRAY['Footprinting and Reconnaissance', 'Scanning Networks', 'Enumeration', 'Vulnerability Analysis', 'System Hacking', 'Malware Threats', 'Social Engineering', 'Web Application Hacking', 'SQL Injection', 'Cryptography'],
'Security officers, auditors, security professionals, site admins, anyone concerned about network infrastructure integrity',
'2+ years security experience',
'Multiple choice', 240, 125, 700,
'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/', 3, true, NOW(), NOW()),

('cert_cissp', 'cissp', 'CISSP', 'Certified Information Systems Security Professional', 'CISSP', 'prov_isc2', 'ADVANCED', 'GOVERNANCE_RISK',
'Gold standard in cybersecurity certifications. Covers all aspects of information security from risk management to cryptography.',
ARRAY['Security and Risk Management', 'Asset Security', 'Security Architecture', 'Communication and Network Security', 'Identity and Access Management', 'Security Assessment', 'Security Operations', 'Software Development Security'],
'Senior security practitioners, managers, executives',
'5+ years paid security experience in 2+ domains',
'CAT adaptive test', 360, 125, 700,
'https://www.isc2.org/Certifications/CISSP', 3, true, NOW(), NOW()),

('cert_oscp', 'oscp', 'OSCP', 'Offensive Security Certified Professional', 'OSCP', 'prov_offensive', 'ADVANCED', 'OFFENSIVE_SECURITY',
'Hands-on penetration testing certification. 24-hour practical exam on isolated network.',
ARRAY['Information Gathering', 'Vulnerability Scanning', 'Buffer Overflows', 'Client-Side Attacks', 'Web Application Attacks', 'Password Attacks', 'Port Redirection and Tunneling', 'Active Directory'],
'Penetration testers, security researchers, red team professionals',
'Networking fundamentals, Linux command line, scripting basics',
'Practical exam (24h hack + 24h report)', 1440, 0, 70,
'https://www.offensive-security.com/pwk-oscp/', 0, false, NOW(), NOW()),

('cert_cism', 'cism', 'CISM', 'Certified Information Security Manager', 'CISM', 'prov_isaca', 'ADVANCED', 'GOVERNANCE_RISK',
'Management-focused certification covering information security governance, risk management and incident response.',
ARRAY['Information Security Governance', 'Information Risk Management', 'Security Program Development', 'Incident Management'],
'IS managers, risk managers, IT directors and consultants',
'5+ years IS experience, 3+ in security management',
'Multiple choice', 240, 150, 450,
'https://www.isaca.org/credentialing/cism', 3, true, NOW(), NOW()),

('cert_ejpt', 'ejpt', 'eJPT', 'eLearnSecurity Junior Penetration Tester', 'eJPT', 'prov_offensive', 'ENTRY', 'OFFENSIVE_SECURITY',
'Entry-level penetration testing certification with fully practical exam. Ideal starting point for red team career.',
ARRAY['Penetration Testing Processes', 'Networking', 'Web Application Security', 'System Attacks', 'Host Discovery'],
'Beginners interested in penetration testing',
'Basic networking and Linux knowledge',
'Practical exam on lab network', 1440, 0, 70,
'https://elearnsecurity.com/product/ejpt-certification/', 0, false, NOW(), NOW()),

('cert_gpen', 'gpen', 'GPEN', 'GIAC Penetration Tester', 'GPEN', 'prov_sans', 'INTERMEDIATE', 'OFFENSIVE_SECURITY',
'Industry-recognized penetration testing certification covering methodology, reconnaissance and exploitation.',
ARRAY['Comprehensive Pen Testing Process', 'Scanning and Exploitation', 'Password Attacks', 'Web Application Pen Testing'],
'Penetration testers, red team members, security auditors',
'Experience with basic security concepts and tools',
'Multiple choice', 180, 115, 74,
'https://www.giac.org/certifications/penetration-tester-gpen/', 4, true, NOW(), NOW()),

('cert_cysa', 'comptia-cysa-plus', 'CySA+', 'CompTIA Cybersecurity Analyst+', 'CySA+', 'prov_comptia', 'INTERMEDIATE', 'DEFENSIVE_SECURITY',
'Focuses on behavioral analytics to fight cybersecurity threats. Covers threat intelligence, vulnerability management and incident response.',
ARRAY['Security Operations', 'Vulnerability Management', 'Incident Response', 'Reporting and Communication'],
'Threat intelligence analysts, SOC analysts, vulnerability analysts',
'3-4 years hands-on security experience',
'Multiple choice and performance-based', 165, 85, 750,
'https://www.comptia.org/certifications/cybersecurity-analyst', 3, true, NOW(), NOW())

ON CONFLICT (slug) DO NOTHING;

-- Seed: Costs (USD)
INSERT INTO certification_costs (id, "certificationId", region, currency, "examCost", "voucherAvailable", "lastVerified", "createdAt", "updatedAt") VALUES
('cost_sec_plus_us', 'cert_sec_plus', 'NORTH_AMERICA', 'USD', 392, true, NOW(), NOW(), NOW()),
('cost_sec_plus_eu', 'cert_sec_plus', 'EUROPE', 'USD', 392, true, NOW(), NOW(), NOW()),
('cost_ceh_us', 'cert_ceh', 'NORTH_AMERICA', 'USD', 1199, false, NOW(), NOW(), NOW()),
('cost_cissp_us', 'cert_cissp', 'NORTH_AMERICA', 'USD', 749, false, NOW(), NOW(), NOW()),
('cost_oscp_us', 'cert_oscp', 'NORTH_AMERICA', 'USD', 1499, false, NOW(), NOW(), NOW()),
('cost_cism_us', 'cert_cism', 'NORTH_AMERICA', 'USD', 575, false, NOW(), NOW(), NOW()),
('cost_ejpt_us', 'cert_ejpt', 'NORTH_AMERICA', 'USD', 200, false, NOW(), NOW(), NOW()),
('cost_gpen_us', 'cert_gpen', 'NORTH_AMERICA', 'USD', 979, false, NOW(), NOW(), NOW()),
('cost_cysa_us', 'cert_cysa', 'NORTH_AMERICA', 'USD', 392, true, NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING;
