/**
 * API Service Layer
 * Handles all backend API calls for Batimove SaaS
 */

import { QuoteData } from '../types';

// API Base URL - uses Railway in production, proxy in development
const API_BASE = import.meta.env.PROD
    ? 'https://web-production-4353a.up.railway.app/api'
    : '/api';

// Response types
interface ApiResponse {
    success: boolean;
    message?: string;
}

interface QuoteResponse extends ApiResponse {
    quoteId: string;
}

interface ContactResponse extends ApiResponse {
    messageId: string;
}

interface BusinessResponse extends ApiResponse {
    leadId: string;
}

// Contact form data
interface ContactData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// Business lead data
interface BusinessData {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    employeeCount?: string;
    serviceNeeds: string;
}

/**
 * Submit a quote request
 */
export const submitQuote = async (data: QuoteData): Promise<QuoteResponse> => {
    const response = await fetch(`${API_BASE}/quote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit quote');
    }

    return response.json();
};

/**
 * Submit a contact form message
 */
export const submitContact = async (data: ContactData): Promise<ContactResponse> => {
    const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit contact message');
    }

    return response.json();
};

/**
 * Submit a business lead
 */
export const submitBusiness = async (data: BusinessData): Promise<BusinessResponse> => {
    const response = await fetch(`${API_BASE}/business`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit business lead');
    }

    return response.json();
};

// Export all API functions
export const api = {
    submitQuote,
    submitContact,
    submitBusiness,
};
