/**
 * High-Fidelity Mock Dashboards Fallback Generator for Beha Marketing PLC
 * Covers all 8 Organizational Roles (Articles 8–22)
 * Ensures 100% crash-free, rich UI rendering even if backend is offline or loading.
 */

export function getFallbackDashboardData(roleKey, userId = null) {
  const normalized = (roleKey || 'teammember').toLowerCase().replace(/[^a-z]/g, '');

  // 1. CEO Dashboard
  if (normalized.includes('ceo') || normalized.includes('executive')) {
    return {
      role: 'CEO',
      title: 'Chief Executive Officer (CEO) Command Center',
      is_fallback: true,
      kpis: {
        total_revenue: 125400000,
        total_units_sold: 48,
        total_commissions_approved: 1881000,
        active_generation_heads: 2,
        active_branches: 12,
        active_sales_members: 142,
        active_customers: 285,
        pending_approvals_count: 3
      },
      pending_certificates: [
        {
          id: 101,
          certificate_number: 'CERT-2026-0089',
          deal: {
            deal_code: 'DEAL-AYAT-042',
            property: { title: 'Luxury 3BR Villa - Ayat Zone 3', property_code: 'BH-VIL-104', price: 18500000 },
            customer: { full_name: 'Dr. Yonas Mengistu', phone: '+251911223344' },
            agent: { name: 'Tewodros Kassahun', official_id: 'BH-AGT-001' }
          },
          gross_amount: 277500,
          statutory_tax: 5550,
          net_payout: 271950,
          ceo_approved: false,
          created_at: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 102,
          certificate_number: 'CERT-2026-0090',
          deal: {
            deal_code: 'DEAL-BOLE-018',
            property: { title: 'Executive Penthouse - Bole Atlas', property_code: 'BH-APT-208', price: 24000000 },
            customer: { full_name: 'W/ro Bethlehem Haile', phone: '+251922334455' },
            agent: { name: 'Almaz Tadesse', official_id: 'BH-AGT-012' }
          },
          gross_amount: 360000,
          statutory_tax: 7200,
          net_payout: 352800,
          ceo_approved: false,
          created_at: new Date(Date.now() - 3600000 * 8).toISOString()
        }
      ],
      pending_upgrades: [
        {
          id: 1,
          title: 'Decimal Hierarchy ERP v2.4 Automated CBE Payment Integration',
          version: 'v2.4.0',
          study_notes: 'Automates direct bank batch transfer to CBE accounts after CEO certificate authorization per Article 12.3.',
          impact_assessment: 'Reduces commission distribution processing delay from 48h to under 15 minutes.',
          status: 'submitted_to_ceo',
          submitted_by: { name: 'Robel Girma (System Admin)' },
          created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      assemblies: [
        {
          id: 1,
          title: 'Assembly of Generation Heads - Q3 Strategy & Developer Intake',
          meeting_type: 'in_person',
          tier_scope: 'CEO_ASSEMBLY',
          scheduled_at: new Date(Date.now() + 86400000 * 3).toISOString(),
          location_or_link: 'Beha HQ Boardroom - 5th Floor',
          agenda: 'Review 10-Branch Decimal quotas, Ayat phase 2 developer agreements, and commission disbursement audits.',
          status: 'scheduled'
        }
      ],
      contracts: [
        {
          id: 1,
          developer_name: 'Ayat Real Estate Share Company',
          project_name: 'Ayat Hill View Residences',
          total_units: 120,
          commission_rate_percent: 2.0,
          is_active: true,
          signed_by_ceo: true,
          created_at: '2026-01-15T10:00:00Z'
        },
        {
          id: 2,
          developer_name: 'Flintstone Homes PLC',
          project_name: 'Twin Peaks Luxury Towers',
          total_units: 80,
          commission_rate_percent: 2.0,
          is_active: true,
          signed_by_ceo: true,
          created_at: '2026-02-01T11:30:00Z'
        }
      ],
      heatmap: [
        {
          id: 1,
          name: 'Generation 01 Alpha',
          code: 'GEN-01',
          head: { name: 'Alemayehu Tadesse', phone: '+251911445566' },
          branches_count: 10,
          sales_volume: 78500000,
          units_sold: 31,
          target_progress: 88
        },
        {
          id: 2,
          name: 'Generation 02 Beta',
          code: 'GEN-02',
          head: { name: 'Bereket Desta', phone: '+251922556677' },
          branches_count: 2,
          sales_volume: 46900000,
          units_sold: 17,
          target_progress: 74
        }
      ],
      open_disputes: [
        {
          id: 1,
          title: 'Lead Transfer Dispute between Bole & Ayat Branches',
          description: 'Customer inquiry for Bole Atlas Apartment was registered simultaneously by 2 consultants.',
          raised_by: { name: 'Selamawit Bekele (Branch Manager)' },
          status: 'open',
          created_at: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ],
      recent_audits: [
        {
          id: 1,
          action: 'PAYMENT_CERTIFICATE_AUTHORIZED',
          details: 'CEO Dawit Gebremariam authorized disbursement for Certificate #CERT-2026-0088',
          user: { name: 'Dawit Gebremariam (CEO)' },
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 2,
          action: 'SECURITY_PIN_RESET',
          details: 'System Admin processed PIN reset for Consultant BH-AGT-019',
          user: { name: 'Robel Girma (Sys Admin)' },
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ]
    };
  }

  // 2. Information Department Dashboard
  if (normalized.includes('info')) {
    return {
      role: 'INFORMATION_OFFICER',
      title: 'Information Department Data Center',
      is_fallback: true,
      kpis: {
        total_properties: 34,
        published_properties: 28,
        active_contracts: 12,
        pending_data_submissions: 5
      },
      properties: [
        {
          id: 1,
          property_code: 'BH-APT-101',
          title: '2-Bedroom Elegant Apartment (Ayat)',
          property_type: 'apartment',
          price: 9800000,
          area_sqm: 115,
          subcity: 'Yeka',
          specific_area: 'Ayat Zone 3',
          is_published: true,
          developer_contract: { developer_name: 'Ayat Real Estate' },
          created_at: '2026-03-01T08:00:00Z'
        },
        {
          id: 2,
          property_code: 'BH-VIL-204',
          title: 'G+2 Luxury Villa with Garden',
          property_type: 'villa',
          price: 26500000,
          area_sqm: 280,
          subcity: 'Bole',
          specific_area: 'Atlas Near Medhanialem',
          is_published: true,
          developer_contract: { developer_name: 'Flintstone Homes' },
          created_at: '2026-03-05T09:30:00Z'
        },
        {
          id: 3,
          property_code: 'BH-TH-302',
          title: 'Modern Townhouse with Terrace',
          property_type: 'townhouse',
          price: 15400000,
          area_sqm: 165,
          subcity: 'Bole',
          specific_area: 'CMC Michael',
          is_published: false,
          developer_contract: { developer_name: 'Gift Real Estate' },
          created_at: '2026-03-12T14:15:00Z'
        }
      ],
      contracts: [
        {
          id: 1,
          contract_code: 'DEV-CTR-001',
          developer_name: 'Ayat Real Estate Share Company',
          project_name: 'Ayat Zone 3 Grand Complex',
          total_units: 120,
          is_active: true
        },
        {
          id: 2,
          contract_code: 'DEV-CTR-002',
          developer_name: 'Flintstone Homes PLC',
          project_name: 'Atlas Executive Residences',
          total_units: 80,
          is_active: true
        }
      ],
      incoming_feed: [
        {
          id: 1,
          report_date: new Date().toISOString().split('T')[0],
          member: { name: 'Tewodros Kassahun', official_id: 'BH-AGT-001' },
          calls_made: 12,
          field_visits_conducted: 2,
          activity_summary: 'Conducted 2 client walkthroughs at Ayat Zone 3 for 3-bed apartments.'
        }
      ],
      access_requests: [
        {
          id: 1,
          user: { name: 'Sara Bekele', official_id: 'BH-AGT-022' },
          request_type: 'PROPERTY_CATALOG_EXPORT',
          reason: 'Client requested comprehensive brochure for diaspora investors.',
          status: 'pending',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ],
      security_alerts: [
        {
          id: 1,
          action: 'CONFIDENTIAL_DATA_ACCESS',
          details: 'Title deed legal document BH-DOC-401 viewed by Information Officer Kalkidan Assefa',
          user: { name: 'Kalkidan Assefa (Info Dept)' },
          created_at: new Date(Date.now() - 14400000).toISOString()
        }
      ],
      backup_schedule: {
        last_backup: new Date(Date.now() - 21600000).toISOString(),
        status: 'HEALTHY (Encrypted AES-256 Mirror)',
        storage_usage: '24.2 MB / 50 GB'
      }
    };
  }

  // 3. Finance Department Dashboard
  if (normalized.includes('fin')) {
    return {
      role: 'FINANCE_OFFICER',
      title: 'Finance & Commission Settlement Center',
      is_fallback: true,
      kpis: {
        total_gross_commissions: 2450000,
        total_tax_withheld_2pct: 49000,
        total_net_disbursed: 1980000,
        pending_payout_queue: 421000,
        unapproved_certificates_count: 2
      },
      certificates: [
        {
          id: 1,
          certificate_number: 'CERT-2026-0089',
          deal: {
            deal_code: 'DEAL-AYAT-042',
            sale_price: 18500000,
            property: { title: '3BR Villa - Ayat Zone 3' },
            customer: { full_name: 'Dr. Yonas Mengistu' },
            agent: { name: 'Tewodros Kassahun' }
          },
          gross_amount: 277500,
          statutory_tax: 5550,
          net_payout: 271950,
          ceo_approved: true,
          is_disbursed: false,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          certificate_number: 'CERT-2026-0088',
          deal: {
            deal_code: 'DEAL-BOLE-012',
            sale_price: 12000000,
            property: { title: '2BR Penthouse - Bole' },
            customer: { full_name: 'Ato Solomon Kebede' },
            agent: { name: 'Helen Girma' }
          },
          gross_amount: 180000,
          statutory_tax: 3600,
          net_payout: 176400,
          ceo_approved: true,
          is_disbursed: true,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ],
      disbursements: [
        {
          id: 1,
          beneficiary: { name: 'Tewodros Kassahun', official_id: 'BH-AGT-001' },
          beneficiary_role: 'Direct Sales Consultant (1.50%)',
          net_amount: 271950,
          tax_amount: 5550,
          is_paid: false,
          paymentCertificate: { deal: { deal_code: 'DEAL-AYAT-042' } }
        },
        {
          id: 2,
          beneficiary: { name: 'Yonas Haile', official_id: 'BH-TL-001' },
          beneficiary_role: 'Team Leader Override (0.25%)',
          net_amount: 45325,
          tax_amount: 925,
          is_paid: false,
          paymentCertificate: { deal: { deal_code: 'DEAL-AYAT-042' } }
        },
        {
          id: 3,
          beneficiary: { name: 'Selamawit Bekele', official_id: 'BH-BR-001' },
          beneficiary_role: 'Branch Manager Override (0.15%)',
          net_amount: 27195,
          tax_amount: 555,
          is_paid: false,
          paymentCertificate: { deal: { deal_code: 'DEAL-AYAT-042' } }
        },
        {
          id: 4,
          beneficiary: { name: 'Alemayehu Tadesse', official_id: 'BH-GEN-001' },
          beneficiary_role: 'Generation Head Override (0.10%)',
          net_amount: 18130,
          tax_amount: 370,
          is_paid: false,
          paymentCertificate: { deal: { deal_code: 'DEAL-AYAT-042' } }
        }
      ],
      admin_payroll: [
        { id: 1, name: 'Dawit Gebremariam', official_id: 'BH-CEO-001', department: 'EXECUTIVE', primary_role: 'CEO', base_salary_etb: 65000, status: 'ACTIVE_PAYROLL' },
        { id: 2, name: 'Kalkidan Assefa', official_id: 'BH-INF-001', department: 'INFORMATION', primary_role: 'INFORMATION_OFFICER', base_salary_etb: 28000, status: 'ACTIVE_PAYROLL' },
        { id: 3, name: 'Henok Tesfaye', official_id: 'BH-FIN-001', department: 'FINANCE', primary_role: 'FINANCE_OFFICER', base_salary_etb: 28000, status: 'ACTIVE_PAYROLL' },
        { id: 4, name: 'Robel Girma', official_id: 'BH-SYS-001', department: 'SYSTEM_ADMIN', primary_role: 'SYSTEM_ADMIN', base_salary_etb: 30000, status: 'ACTIVE_PAYROLL' }
      ],
      tax_deduction_ledger: [
        { id: 1, beneficiary_name: 'Tewodros Kassahun', role_tier: 'Direct Agent (1.5%)', gross_amount: 277500, tax_2pct: 5550, net_payable: 271950, deal_ref: 'DEAL-AYAT-042', is_paid: false },
        { id: 2, beneficiary_name: 'Helen Girma', role_tier: 'Direct Agent (1.5%)', gross_amount: 180000, tax_2pct: 3600, net_payable: 176400, deal_ref: 'DEAL-BOLE-012', is_paid: true }
      ]
    };
  }

  // 4. System Administrator Dashboard
  if (normalized.includes('sys') || normalized.includes('admin')) {
    return {
      role: 'SYSTEM_ADMIN',
      title: 'System Administration & Security Control',
      is_fallback: true,
      kpis: {
        total_accounts: 14,
        active_sessions: 4,
        security_audits: 28,
        pending_access_requests: 2,
        system_upgrades_pending: 1
      },
      users: [
        { id: 1, name: 'Dawit Gebremariam', official_id: 'BH-CEO-001', primary_role: 'CEO', email: 'dawit.ceo@beha.com', phone: '+251911100001', structure_type: 'EXECUTIVE', grade_level: 5, is_banned: false, created_at: '2026-01-01T00:00:00Z' },
        { id: 2, name: 'Kalkidan Assefa', official_id: 'BH-INF-001', primary_role: 'INFORMATION_OFFICER', email: 'kalkidan.info@beha.com', phone: '+251911100002', structure_type: 'ADMINISTRATIVE', grade_level: 4, is_banned: false, created_at: '2026-01-02T00:00:00Z' },
        { id: 3, name: 'Henok Tesfaye', official_id: 'BH-FIN-001', primary_role: 'FINANCE_OFFICER', email: 'henok.fin@beha.com', phone: '+251911100003', structure_type: 'ADMINISTRATIVE', grade_level: 4, is_banned: false, created_at: '2026-01-03T00:00:00Z' },
        { id: 4, name: 'Robel Girma', official_id: 'BH-SYS-001', primary_role: 'SYSTEM_ADMIN', email: 'robel.sysadmin@beha.com', phone: '+251911100004', structure_type: 'ADMINISTRATIVE', grade_level: 4, is_banned: false, created_at: '2026-01-04T00:00:00Z' },
        { id: 5, name: 'Alemayehu Tadesse', official_id: 'BH-GEN-001', primary_role: 'GENERATION_HEAD', email: 'alemayehu.gen01@beha.com', phone: '+251911100005', structure_type: 'SALES', grade_level: 5, is_banned: false, created_at: '2026-01-05T00:00:00Z' },
        { id: 6, name: 'Selamawit Bekele', official_id: 'BH-BR-001', primary_role: 'BRANCH_MANAGER', email: 'selamawit.bm01@beha.com', phone: '+251911100006', structure_type: 'SALES', grade_level: 4, is_banned: false, created_at: '2026-01-06T00:00:00Z' },
        { id: 7, name: 'Yonas Haile', official_id: 'BH-TL-001', primary_role: 'TEAM_LEADER', email: 'yonas.tl01@beha.com', phone: '+251911100007', structure_type: 'SALES', grade_level: 3, is_banned: false, created_at: '2026-01-07T00:00:00Z' },
        { id: 8, name: 'Tewodros Kassahun', official_id: 'BH-AGT-001', primary_role: 'TEAM_MEMBER', email: 'tewodros.agent@beha.com', phone: '+251911100008', structure_type: 'SALES', grade_level: 1, is_banned: false, created_at: '2026-01-08T00:00:00Z' }
      ],
      audit_logs: [
        { id: 1, action: 'USER_LOGIN_SUCCESS', details: 'Authorized login for Robel Girma (BH-SYS-001)', user: { name: 'Robel Girma' }, created_at: new Date().toISOString() },
        { id: 2, action: 'PASSWORD_RESET_PROCESSED', details: 'System Admin updated PIN for Consultant BH-AGT-008', user: { name: 'Robel Girma' }, created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, action: 'DATABASE_BACKUP_SNAPSHOT', details: 'Automated encrypted MySQL backup snapshot executed successfully', user: { name: 'System Cron' }, created_at: new Date(Date.now() - 7200000).toISOString() }
      ],
      access_requests: [
        { id: 1, user: { name: 'Sara Bekele', official_id: 'BH-AGT-022' }, request_type: 'CATALOG_EXPORT_PERMISSION', reason: 'High-net-worth client requires full offline catalog portfolio.', status: 'pending', created_at: new Date(Date.now() - 5400000).toISOString() },
        { id: 2, user: { name: 'Getachew Assefa', official_id: 'BH-TL-004' }, request_type: 'SPECIAL_COMMISSION_AUDIT', reason: 'Reviewing branch override discrepancy for closed deal #42.', status: 'pending', created_at: new Date(Date.now() - 10800000).toISOString() }
      ],
      system_upgrades: [
        { id: 1, title: 'Decimal Hierarchy ERP v2.4 Automated CBE Integration', version: 'v2.4.0', study_notes: 'CBE direct banking API bridge per Article 12.3.', impact_assessment: 'Automates payout routing instantly upon CEO sign-off.', status: 'submitted_to_ceo', submitted_by: { name: 'Robel Girma' }, created_at: new Date(Date.now() - 86400000).toISOString() }
      ],
      system_health: {
        server_status: 'ONLINE',
        php_version: '8.2.4',
        database: 'beha_db',
        db_tables: 16,
        api_latency_ms: 2.4,
        uptime_hours: 142.5
      }
    };
  }

  // 5. Generation Head Dashboard
  if (normalized.includes('gen')) {
    return {
      role: 'GENERATION_HEAD',
      title: 'Generation Head Oversight Console',
      is_fallback: true,
      kpis: {
        total_branches: 10,
        total_agents: 100,
        monthly_volume: 48500000,
        leadership_override_etb: 48500,
        pending_disputes: 1
      },
      generation: {
        id: 1,
        name: 'Generation 01 Alpha',
        generation_code: 'GEN-01',
        head: { name: 'Alemayehu Tadesse', official_id: 'BH-GEN-001' }
      },
      branches: [
        { id: 1, name: 'Ayat Main Branch', code: 'BR-01', manager: { name: 'Selamawit Bekele' }, teams_count: 10, agents_count: 48, monthly_sales: 18500000 },
        { id: 2, name: 'Bole Atlas Branch', code: 'BR-02', manager: { name: 'Tamirat Alemu' }, teams_count: 10, agents_count: 52, monthly_sales: 30000000 }
      ],
      tendency_reports: [
        {
          id: 1,
          branch: { name: 'Ayat Main Branch' },
          branchManager: { name: 'Selamawit Bekele' },
          report_period: 'March 2026',
          buyer_tendency_summary: 'High demand for 3-bedroom ready-to-move apartments in Ayat and CMC areas within 12M-18M ETB range.',
          common_objections: 'Clients requesting longer installment schedules (up to 24 months).',
          average_budget_etb: 15000000,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      disputes: [
        {
          id: 1,
          title: 'Customer Lead Duplicate Registration',
          dispute_type: 'customer_claim',
          description: 'Dispute between Ayat Branch and Bole Branch over diaspora buyer Dr. Yonas Mengistu.',
          raised_by: { name: 'Selamawit Bekele' },
          branch: { name: 'Ayat Main Branch' },
          status: 'open',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      meetings: [
        {
          id: 1,
          title: 'Bi-Weekly Assembly of Branch Managers',
          scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(),
          location_or_link: 'Ayat Branch Conference Room',
          agenda: 'Review 10-day lead reassignment protocol and Q2 developer quotas.'
        }
      ]
    };
  }

  // 6. Branch Manager Dashboard
  if (normalized.includes('branch') || normalized.includes('bm')) {
    return {
      role: 'BRANCH_MANAGER',
      title: 'Branch Manager Operations Command',
      is_fallback: true,
      kpis: {
        active_teams: 10,
        total_consultants: 48,
        monthly_branch_sales: 18500000,
        branch_override_etb: 27750,
        active_prospects: 64,
        inactive_leads_alert: 3
      },
      branch: {
        id: 1,
        name: 'Ayat Main Branch',
        code: 'BR-01',
        manager: { name: 'Selamawit Bekele' }
      },
      teams: [
        { id: 1, name: 'Alpha Squad 1', code: 'TM-01', leader: { name: 'Yonas Haile' }, members_count: 10, active_pipeline: 14, monthly_sales: 8500000 },
        { id: 2, name: 'Alpha Squad 2', code: 'TM-02', leader: { name: 'Bethlehem Desta' }, members_count: 10, active_pipeline: 12, monthly_sales: 10000000 }
      ],
      customers: [
        {
          id: 1,
          full_name: 'Dr. Yonas Mengistu',
          phone: '+251911223344',
          preferred_property_type: 'Villa',
          budget_max: 20000000,
          registered_by: { name: 'Tewodros Kassahun' },
          days_inactive: 2,
          created_at: '2026-03-10T10:00:00Z'
        },
        {
          id: 2,
          full_name: 'Ato Solomon Kebede',
          phone: '+251922334455',
          preferred_property_type: 'Apartment',
          budget_max: 14000000,
          registered_by: { name: 'Helen Girma' },
          days_inactive: 12,
          is_neglected: true,
          created_at: '2026-03-01T11:00:00Z'
        }
      ],
      diaries: [
        {
          id: 1,
          report_date: new Date().toISOString().split('T')[0],
          member: { name: 'Tewodros Kassahun' },
          team: { name: 'Alpha Squad 1' },
          calls_made: 14,
          field_visits_conducted: 2,
          customers_registered: 1,
          activity_summary: 'Guided walkthrough at Ayat Zone 3 for Dr. Yonas Mengistu.',
          leader_verified: true
        }
      ],
      tendency_reports: [
        {
          id: 1,
          report_period: 'March 2026',
          buyer_tendency_summary: 'High demand for 3-bedroom ready apartments in Ayat & CMC.',
          common_objections: 'Installment flexibility requested.',
          average_budget_etb: 15000000
        }
      ],
      disputes: []
    };
  }

  // 7. Team Leader Dashboard
  if (normalized.includes('leader') || normalized.includes('tl')) {
    return {
      role: 'TEAM_LEADER',
      title: 'Team Leader Field Operations Console',
      is_fallback: true,
      kpis: {
        managed_consultants: 10,
        total_team_calls_today: 48,
        daily_visits_conducted: 6,
        pending_diary_verifications: 2,
        team_override_etb: 14500
      },
      team: {
        id: 1,
        name: 'Alpha Squad 1',
        code: 'TM-01',
        leader: { name: 'Yonas Haile', official_id: 'BH-TL-001' }
      },
      members: [
        { id: 8, name: 'Tewodros Kassahun', official_id: 'BH-AGT-001', grade_level: 1, phone: '+251911100008', deals_count: 2, calls_today: 14, visits_today: 2, diary_submitted: true },
        { id: 9, name: 'Almaz Tadesse', official_id: 'BH-AGT-002', grade_level: 1, phone: '+251911100009', deals_count: 1, calls_today: 12, visits_today: 1, diary_submitted: true },
        { id: 10, name: 'Bereket Kebede', official_id: 'BH-AGT-003', grade_level: 2, phone: '+251911100010', deals_count: 3, calls_today: 10, visits_today: 1, diary_submitted: false }
      ],
      diary_review_queue: [
        {
          id: 101,
          report_date: new Date().toISOString().split('T')[0],
          member: { id: 8, name: 'Tewodros Kassahun', official_id: 'BH-AGT-001' },
          calls_made: 14,
          field_visits_conducted: 2,
          customers_registered: 1,
          activity_summary: 'Guided client tour at Ayat Zone 3 Villa site. Buyer expressed strong interest in Unit #104.',
          challenges_encountered: 'Client inquired about bank loan guarantee terms.',
          leader_verified: false
        },
        {
          id: 102,
          report_date: new Date().toISOString().split('T')[0],
          member: { id: 9, name: 'Almaz Tadesse', official_id: 'BH-AGT-002' },
          calls_made: 12,
          field_visits_conducted: 1,
          customers_registered: 1,
          activity_summary: 'Telephone follow-ups with 5 diaspora investors for CMC apartments.',
          challenges_encountered: 'Timezone delays.',
          leader_verified: false
        }
      ],
      customers: [
        { id: 1, full_name: 'Dr. Yonas Mengistu', phone: '+251911223344', preferred_property_type: 'Villa', budget_max: 20000000, registered_by: { name: 'Tewodros Kassahun' } },
        { id: 2, full_name: 'W/ro Bethlehem Haile', phone: '+251922334455', preferred_property_type: 'Apartment', budget_max: 24000000, registered_by: { name: 'Almaz Tadesse' } }
      ],
      morning_meetings: [
        { id: 1, title: '8:30 AM Daily Team Briefing & Target Setting', scheduled_at: '08:30 AM', location_or_link: 'Alpha Squad Meeting Area', agenda: 'Reviewing today’s Ayat site visits and closing targets.' }
      ]
    };
  }

  // 8. Team Member (Direct Sales Consultant) Dashboard
  return {
    role: 'TEAM_MEMBER',
    title: 'Direct Sales Agent Workplace',
    is_fallback: true,
    kpis: {
      my_closed_deals: 4,
      my_commissions_earned: 360000,
      calls_logged_this_month: 142,
      site_visits_held: 18,
      pending_disbursements: 45000
    },
    user: {
      id: userId || 8,
      name: 'Tewodros Kassahun',
      official_id: 'BH-AGT-001',
      team_id: 1,
      primary_role: 'TEAM_MEMBER',
      grade_level: 1
    },
    my_deals: [
      {
        id: 1,
        deal_code: 'DEAL-AYAT-042',
        sale_price: 18500000,
        commission_earned: 277500,
        deal_status: 'SETTLED',
        property: { title: '3BR Luxury Villa - Ayat Zone 3', property_code: 'BH-VIL-104' },
        customer: { full_name: 'Dr. Yonas Mengistu' },
        created_at: '2026-03-10T14:30:00Z'
      },
      {
        id: 2,
        deal_code: 'DEAL-CMC-019',
        sale_price: 11000000,
        commission_earned: 165000,
        deal_status: 'PROCESSING_CERTIFICATE',
        property: { title: '2BR Modern Apartment - CMC', property_code: 'BH-APT-088' },
        customer: { full_name: 'Ato Hailu Shawel' },
        created_at: '2026-03-18T16:00:00Z'
      }
    ],
    my_disbursements: [
      {
        id: 1,
        deal_code: 'DEAL-AYAT-042',
        gross_amount: 277500,
        tax_amount: 5550,
        net_amount: 271950,
        is_paid: true,
        created_at: '2026-03-12T10:00:00Z'
      }
    ],
    my_diaries: [
      {
        id: 1,
        report_date: new Date().toISOString().split('T')[0],
        calls_made: 14,
        field_visits_conducted: 2,
        customers_registered: 1,
        activity_summary: 'Guided client tour at Ayat Zone 3 Villa site. Buyer expressed strong interest in Unit #104.',
        challenges_encountered: 'Client inquired about bank loan guarantee terms.',
        leader_verified: true,
        leader_notes: 'Excellent job Tewodros. Follow up tomorrow with title deed copies.'
      }
    ],
    my_customers: [
      { id: 1, full_name: 'Dr. Yonas Mengistu', phone: '+251911223344', preferred_property_type: 'Villa', budget_max: 20000000, status: 'Active Prospect' },
      { id: 2, full_name: 'Ato Hailu Shawel', phone: '+251911556677', preferred_property_type: 'Apartment', budget_max: 12000000, status: 'Contract Signed' }
    ],
    property_catalog: [
      { id: 1, property_code: 'BH-VIL-104', title: '3BR Luxury Villa - Ayat Zone 3', price: 18500000, property_type: 'villa', subcity: 'Yeka', specific_area: 'Ayat Zone 3' },
      { id: 2, property_code: 'BH-APT-208', title: 'Executive Penthouse - Bole Atlas', price: 24000000, property_type: 'apartment', subcity: 'Bole', specific_area: 'Atlas' },
      { id: 3, property_code: 'BH-APT-088', title: '2BR Modern Apartment - CMC', price: 11000000, property_type: 'apartment', subcity: 'Bole', specific_area: 'CMC' }
    ]
  };
}
