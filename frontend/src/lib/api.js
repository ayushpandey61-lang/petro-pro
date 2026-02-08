const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    const currentUser = localStorage.getItem('petropro_current_user');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authentication headers if available
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // For development: send user info in headers for localStorage-based auth
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        config.headers['X-User-Email'] = user.email;
        config.headers['X-User-Role'] = user.role;
      } catch (error) {
        console.warn('Error parsing current user data:', error);
      }
    }

    try {
      console.log('API Request:', url, config);
      const response = await fetch(url, config);

      // Handle empty response
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('API Response:', response.status, data);

      if (!response.ok) {
        throw new Error(typeof data === 'string' ? data : (data.error || 'API request failed'));
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email, password, options) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, options }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // Master data methods
  async getEmployees() {
    return this.request('/master/employees');
  }

  async createEmployee(employee) {
    return this.request('/master/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id, employee) {
    return this.request(`/master/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id) {
    return this.request(`/master/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Generic master data methods
  async getMasterData(table) {
    return this.request(`/master/${table}`);
  }

  async createMasterData(table, data) {
    return this.request(`/master/${table}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMasterData(table, id, data) {
    return this.request(`/master/${table}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMasterData(table, id) {
    return this.request(`/master/${table}/${id}`, {
      method: 'DELETE',
    });
  }

  // Day business methods
  async getDayAssigning() {
    return this.request('/day-business/assigning');
  }

  async createDayAssigning(data) {
    return this.request('/day-business/assigning', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSaleRates() {
    return this.request('/day-business/sale-rates');
  }

  async createSaleRate(data) {
    return this.request('/day-business/sale-rates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSaleEntries() {
    return this.request('/day-business/sale-entries');
  }

  async createSaleEntry(data) {
    return this.request('/day-business/sale-entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLubricantsSale() {
    return this.request('/day-business/lubricants-sale');
  }

  async createLubricantsSale(data) {
    return this.request('/day-business/lubricants-sale', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLubricantsSale(id, data) {
    return this.request(`/day-business/lubricants-sale/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLubricantsSale(id) {
    return this.request(`/day-business/lubricants-sale/${id}`, {
      method: 'DELETE',
    });
  }

  async getSwipeTransactions() {
    return this.request('/day-business/swipe');
  }

  async createSwipeTransaction(data) {
    return this.request('/day-business/swipe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCreditSales() {
    return this.request('/day-business/credit-sale');
  }

  async createCreditSale(data) {
    return this.request('/day-business/credit-sale', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getExpenses() {
    return this.request('/day-business/expenses');
  }

  async createExpense(data) {
    return this.request('/day-business/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRecovery() {
    return this.request('/day-business/recovery');
  }

  async createRecovery(data) {
    return this.request('/day-business/recovery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOpeningStock() {
    return this.request('/day-business/opening-stock');
  }

  async createOpeningStock(data) {
    return this.request('/day-business/opening-stock', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSettlement() {
    return this.request('/day-business/settlement');
  }

  async createSettlement(data) {
    return this.request('/day-business/settlement', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reports methods
  async getAllCreditCustomerReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/all-credit-customer?${queryString}`);
  }

  async getAttendanceReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/attendance?${queryString}`);
  }

  async getBusinessFlowReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/business-flow?${queryString}`);
  }

  async getCustomerStatement(customerId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/customer-statement/${customerId}?${queryString}`);
  }

  async getDailyRateHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/daily-rate-history?${queryString}`);
  }

  async getSalesReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/sales?${queryString}`);
  }

  async getLubricantsStockReport() {
    return this.request('/reports/lubricants-stock');
  }

  async getPurchaseReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/purchase?${queryString}`);
  }

  // Invoices methods
  async getLiquidPurchases() {
    return this.request('/invoices/liquid-purchase');
  }

  async createLiquidPurchase(data) {
    return this.request('/invoices/liquid-purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLubePurchases() {
    return this.request('/invoices/lube-purchase');
  }

  async createLubePurchase(data) {
    return this.request('/invoices/lube-purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSalesInvoices() {
    return this.request('/invoices/sales');
  }

  async createSalesInvoice(data) {
    return this.request('/invoices/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateInvoicePDF(id, type) {
    return this.request(`/invoices/generate-pdf/${id}?type=${type}`);
  }

  // Permissions
  async getPermissions(roleName) {
    return this.request(`/auth/permissions/${roleName}`);
  }
}

export const apiClient = new ApiClient();