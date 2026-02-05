/**
 * API Service Layer
 * Handles email sending for Batimove SaaS using EmailJS
 */

import emailjs from '@emailjs/browser';
import { QuoteData } from '../types';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_akaw9of';
const EMAILJS_TEMPLATE_QUOTE = 'template_9n214zz'; // Quote/Devis Express template
const EMAILJS_TEMPLATE_CONTACT = 'template_tnia1q5'; // Contact form template
const EMAILJS_PUBLIC_KEY = 'yflDdVrcEumOX4Ogs';

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

// Helper function to map service IDs to French names
const getServiceName = (serviceId: string): string => {
    const serviceNames: Record<string, string> = {
        'priv': 'Déménagement Privé',
        'pro': 'Transfert Pro',
        'clean': 'Nettoyage',
        'storage': 'Garde-Meubles',
        'lift': 'Monte-Meubles',
        'inter': 'International',
        'general': 'Sur Mesure'
    };
    return serviceNames[serviceId] || serviceId;
};

/**
 * Submit a quote request via EmailJS
 */
export const submitQuote = async (data: QuoteData): Promise<QuoteResponse> => {
    try {
        // Prepare email template parameters
        const templateParams = {
            service_name: getServiceName(data.serviceId),
            service_id: data.serviceId,
            client_name: data.contact.name,
            client_email: data.contact.email,
            client_phone: data.contact.phone,
            date: data.date,
            from_zip: data.fromZip || 'N/A',
            to_zip: data.toZip || 'N/A',
            volume: data.volume || 'N/A',
            rooms: data.rooms || 'N/A',
            housing_type: data.housingType || 'N/A',
            surface: data.surface || 'N/A',
            duration: data.duration || 'N/A',
            floor: data.floor !== undefined ? data.floor : 'N/A',
            to_email: 'info@batimove.ch' // Company email
        };

        // Send email via EmailJS
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_QUOTE,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        // Generate unique ID for the quote
        const quoteId = crypto.randomUUID();

        return {
            success: true,
            quoteId: quoteId,
            message: 'Votre demande de devis a été enregistrée avec succès.'
        };
    } catch (error) {
        console.error('Error sending quote email:', error);
        throw new Error('Failed to submit quote. Please try again.');
    }
};

/**
 * Submit a contact form message via EmailJS
 */
export const submitContact = async (data: ContactData): Promise<ContactResponse> => {
    try {
        // Prepare email template parameters
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_email: 'info@batimove.ch' // Company email
        };

        // Send email via EmailJS
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_CONTACT,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        // Generate unique ID for the message
        const messageId = crypto.randomUUID();

        return {
            success: true,
            messageId: messageId,
            message: 'Votre message a été envoyé avec succès.'
        };
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw new Error('Failed to submit contact message. Please try again.');
    }
};

/**
 * Submit a business lead via EmailJS
 * Note: You can create a third template for this if needed
 */
export const submitBusiness = async (data: BusinessData): Promise<BusinessResponse> => {
    try {
        // For now, using contact template with business data
        const templateParams = {
            from_name: `${data.contactName} (${data.companyName})`,
            from_email: data.email,
            subject: 'Business Lead - B2B Partnership',
            message: `
Company: ${data.companyName}
Contact: ${data.contactName}
Phone: ${data.phone}
Employee Count: ${data.employeeCount || 'N/A'}
Service Needs: ${data.serviceNeeds}
            `.trim(),
            to_email: 'info@batimove.ch'
        };

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_CONTACT,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        const leadId = crypto.randomUUID();

        return {
            success: true,
            leadId: leadId,
            message: 'Merci pour votre intérêt. Notre équipe vous contactera sous 48h.'
        };
    } catch (error) {
        console.error('Error sending business lead:', error);
        throw new Error('Failed to submit business lead. Please try again.');
    }
};

// Export all API functions
export const api = {
    submitQuote,
    submitContact,
    submitBusiness,
};
