/**
 * API Service for Beha Marketing PLC
 * Integrates Frontend with Laravel Backend & MySQL (beha_db)
 * Reflects Operational Guidelines (Articles 8 - 19)
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/Beha/backend/public/api';

/**
 * Health check & Database connection
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'error', message: err.message, database: { connected: false } };
  }
}

/**
 * 1. Organization Tree (Articles 3C, 4, 5, 8-11)
 */
export async function fetchOrganizationTree() {
  const res = await fetch(`${API_BASE_URL}/organization/tree`);
  if (!res.ok) throw new Error(`Failed to load organization tree: ${res.status}`);
  return await res.json();
}

/**
 * 2. Staff Roster with Grade Levels (Articles 16-19)
 */
export async function fetchRoster() {
  const res = await fetch(`${API_BASE_URL}/roster`);
  if (!res.ok) throw new Error(`Failed to load roster: ${res.status}`);
  return await res.json();
}

export async function registerStaff(staffData) {
  const res = await fetch(`${API_BASE_URL}/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(staffData),
  });
  if (!res.ok) throw new Error(`Failed to register staff consultant: ${res.status}`);
  return await res.json();
}

/**
 * 3. Properties (Articles 12.4, 13.2, 16.6)
 */
export async function fetchProperties() {
  const res = await fetch(`${API_BASE_URL}/properties`);
  if (!res.ok) throw new Error(`Failed to load properties: ${res.status}`);
  return await res.json();
}

/**
 * 4. Customers & Client Leads (Articles 8.3, 19.1)
 */
export async function fetchCustomers() {
  const res = await fetch(`${API_BASE_URL}/customers`);
  if (!res.ok) throw new Error(`Failed to load customers: ${res.status}`);
  return await res.json();
}

export async function createCustomer(customerData) {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) throw new Error(`Failed to register customer: ${res.status}`);
  return await res.json();
}

/**
 * 5. Daily Activity Reports / Diaries (Articles 8.4, 18.3, 19.2)
 */
export async function fetchDiaries() {
  const res = await fetch(`${API_BASE_URL}/diaries`);
  if (!res.ok) throw new Error(`Failed to load diaries: ${res.status}`);
  return await res.json();
}

export async function submitDiary(diaryData) {
  const res = await fetch(`${API_BASE_URL}/diaries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(diaryData),
  });
  if (!res.ok) throw new Error(`Failed to submit diary: ${res.status}`);
  return await res.json();
}

/**
 * 6. Branch Tendency Reports (Articles 9.5, 17.6)
 */
export async function fetchTendencyReports() {
  const res = await fetch(`${API_BASE_URL}/tendency-reports`);
  if (!res.ok) throw new Error(`Failed to load tendency reports: ${res.status}`);
  return await res.json();
}

/**
 * 7. Payment Certificates & CEO Approval (Articles 12.3, 14.2)
 */
export async function fetchPaymentCertificates() {
  const res = await fetch(`${API_BASE_URL}/payment-certificates`);
  if (!res.ok) throw new Error(`Failed to load payment certificates: ${res.status}`);
  return await res.json();
}

export async function approvePaymentCertificate(certificateId) {
  const res = await fetch(`${API_BASE_URL}/payment-certificates/${certificateId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to approve certificate: ${res.status}`);
  return await res.json();
}

/**
 * 8. Article 22: Salary & Commission Distribution Calculator & Deal Execution
 */
export async function calculateCommission(salePrice, agentId) {
  const res = await fetch(`${API_BASE_URL}/commission/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ sale_price: salePrice, agent_id: agentId }),
  });
  if (!res.ok) throw new Error(`Failed to calculate commission: ${res.status}`);
  return await res.json();
}

export async function createSalesDeal(dealData) {
  const res = await fetch(`${API_BASE_URL}/deals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(dealData),
  });
  if (!res.ok) throw new Error(`Failed to create deal & certificate: ${res.status}`);
  return await res.json();
}

/**
 * 9. Role-Based Dashboards (Articles 8-19, 22)
 */
export async function fetchRoleDashboard(role, userId = null) {
  const query = userId ? `?user_id=${userId}` : '';
  const res = await fetch(`${API_BASE_URL}/dashboards/${role}${query}`);
  if (!res.ok) throw new Error(`Failed to load ${role} dashboard: ${res.status}`);
  return await res.json();
}

export async function scheduleMeeting(meetingData) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/meeting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(meetingData),
  });
  if (!res.ok) throw new Error(`Failed to schedule meeting: ${res.status}`);
  return await res.json();
}

export async function submitSystemUpgrade(upgradeData) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/upgrade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(upgradeData),
  });
  if (!res.ok) throw new Error(`Failed to submit upgrade proposal: ${res.status}`);
  return await res.json();
}

export async function fileDispute(disputeData) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/dispute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(disputeData),
  });
  if (!res.ok) throw new Error(`Failed to file dispute: ${res.status}`);
  return await res.json();
}

export async function resolveDispute(data) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/resolve-dispute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to resolve dispute: ${res.status}`);
  return await res.json();
}

export async function submitAccessRequest(data) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/access-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to submit access request: ${res.status}`);
  return await res.json();
}

export async function reviewAccessRequest(data) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/review-access-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to review access request: ${res.status}`);
  return await res.json();
}

export async function verifyDiary(data) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/verify-diary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to verify diary: ${res.status}`);
  return await res.json();
}

export async function triggerBackup() {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/backup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to trigger backup: ${res.status}`);
  return await res.json();
}

export async function disburseCertificate(certificateId) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/disburse-certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ certificate_id: certificateId }),
  });
  if (!res.ok) throw new Error(`Failed to disburse certificate: ${res.status}`);
  return await res.json();
}

export async function issueCeoDirective(directiveData) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/ceo-directive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(directiveData),
  });
  if (!res.ok) throw new Error(`Failed to issue directive: ${res.status}`);
  return await res.json();
}

export async function signDeveloperContract(contractData) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/contract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(contractData),
  });
  if (!res.ok) throw new Error(`Failed to sign contract: ${res.status}`);
  return await res.json();
}

export async function publishProperty(propertyData) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/property`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (!res.ok) throw new Error(`Failed to publish property: ${res.status}`);
  return await res.json();
}

export async function reassignCustomerLead(customerId, newAgentId) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/reassign-lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ customer_id: customerId, new_agent_id: newAgentId }),
  });
  if (!res.ok) throw new Error(`Failed to reassign lead: ${res.status}`);
  return await res.json();
}

export async function resetStaffPin(userId, newPin) {
  const res = await fetch(`${API_BASE_URL}/dashboards/actions/reset-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ user_id: userId, new_pin: newPin }),
  });
  if (!res.ok) throw new Error(`Failed to reset PIN: ${res.status}`);
  return await res.json();
}

export default {
  API_BASE_URL,
  checkBackendHealth,
  fetchOrganizationTree,
  fetchRoster,
  registerStaff,
  fetchProperties,
  fetchCustomers,
  createCustomer,
  fetchDiaries,
  submitDiary,
  fetchTendencyReports,
  fetchPaymentCertificates,
  approvePaymentCertificate,
  calculateCommission,
  createSalesDeal,
  fetchRoleDashboard,
  scheduleMeeting,
  submitSystemUpgrade,
  fileDispute,
  resolveDispute,
  submitAccessRequest,
  reviewAccessRequest,
  verifyDiary,
  triggerBackup,
  disburseCertificate,
  issueCeoDirective,
  signDeveloperContract,
  publishProperty,
  reassignCustomerLead,
  resetStaffPin,
};


