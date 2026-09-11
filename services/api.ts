/**
 * API Service Layer
 * Handles email sending for Batimove SaaS using EmailJS
 */

import emailjs from '@emailjs/browser';
import { QuoteData } from '../types';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_dasl0mc';
const EMAILJS_TEMPLATE_QUOTE = 'template_9n214zz'; // Quote/Devis Express template
const EMAILJS_TEMPLATE_CONTACT = 'template_tnia1q5'; // Contact form template
const EMAILJS_PUBLIC_KEY = 'yflDdVrcEumOX4Ogs';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

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
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_QUOTE,
            templateParams
        );

        console.log('EmailJS Quote Response:', response);

        // Also record in Batimove OS Supabase / LocalStorage
        try {
            const { saveLead } = await import('./supabaseClient');
            await saveLead({
                client_name: data.contact.name,
                client_phone: data.contact.phone,
                client_email: data.contact.email,
                service_type: getServiceName(data.serviceId),
                from_city: data.fromZip || 'Genève',
                to_city: data.toZip || 'Genève',
                move_date: data.date,
                details: `Logement: ${data.housingType || 'N/A'}, Pièces: ${data.rooms || 'N/A'}, Surface: ${data.surface || 'N/A'}, Étage: ${data.floor ?? 'N/A'}`,
                amount_chf: 0,
                estimated_amount_chf: 0,
                status: 'nouveau'
            });
        } catch (dbErr) {
            console.warn('Batimove OS save lead non-blocking notice:', dbErr);
        }

        // Generate unique ID for the quote
        const quoteId = crypto.randomUUID();

        return {
            success: true,
            quoteId: quoteId,
            message: 'Votre demande de devis a été enregistrée avec succès.'
        };
    } catch (error) {
        console.error('Error sending quote email:', error);
        console.error('Template params:', {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_QUOTE
        });
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
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_CONTACT,
            templateParams
        );

        console.log('EmailJS Contact Response:', response);

        // Also record in Batimove OS Supabase / LocalStorage
        try {
            const { saveLead } = await import('./supabaseClient');
            const phoneMatch = data.message.match(/Téléphone:\s*([^\n\r]+)/i);
            const phone = phoneMatch ? phoneMatch[1].trim() : '+41 22 000 00 00';
            await saveLead({
                client_name: data.name,
                client_email: data.email,
                client_phone: phone,
                service_type: data.subject || 'Demande de Contact Web',
                from_city: 'Genève',
                to_city: 'Genève',
                details: data.message,
                amount_chf: 0,
                estimated_amount_chf: 0,
                status: 'nouveau'
            });
        } catch (dbErr) {
            console.warn('Batimove OS save lead from contact notice:', dbErr);
        }

        // Generate unique ID for the message
        const messageId = crypto.randomUUID();

        return {
            success: true,
            messageId: messageId,
            message: 'Votre message a été envoyé avec succès.'
        };
    } catch (error) {
        console.error('Error sending contact email:', error);
        console.error('Template params:', {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_CONTACT
        });
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

/**
 * Send volume calculator quote via EmailJS
 */
export const sendQuoteEmail = async (data: {
    name: string;
    email: string;
    phone: string;
    fromZip?: string;
    toZip?: string;
    message?: string;
    volume: string;
    estimatedPrice: string;
    itemCount: string;
    disassembleCount: string;
}): Promise<ApiResponse> => {
    try {
        const templateParams = {
            // Client Information
            from_name: data.name,
            client_name: data.name,
            name: data.name,

            from_email: data.email,
            client_email: data.email,
            email: data.email,
            reply_to: data.email,

            from_phone: data.phone,
            client_phone: data.phone,
            phone: data.phone,
            telephone: data.phone,

            // Address Information
            from_zip: data.fromZip || 'Non spécifié',
            to_zip: data.toZip || 'Non spécifié',

            // Calculator Data
            volume: `${data.volume} m³`,
            volume_total: `${data.volume} m³`,

            estimated_price: `CHF ${data.estimatedPrice}`,
            prix_estime: `CHF ${data.estimatedPrice}`,

            item_count: data.itemCount,
            nombre_items: data.itemCount,

            disassemble_count: data.disassembleCount,
            items_demontage: data.disassembleCount,

            // Message
            message: data.message || 'Demande de devis via calculateur de volume',
            client_message: data.message || 'Demande de devis via calculateur de volume',

            // Destination
            to_email: 'info@batimove.ch',
            to_name: 'Batimove Sarl'
        };

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_QUOTE,
            templateParams
        );

        // Also record in Batimove OS Supabase / LocalStorage
        try {
            const { saveLead } = await import('./supabaseClient');
            const numericPrice = parseFloat(data.estimatedPrice.replace(/[^0-9.]/g, '')) || 0;
            await saveLead({
                client_name: data.name,
                client_phone: data.phone,
                client_email: data.email,
                service_type: `Déménagement Volume (${data.volume} m³)`,
                from_city: data.fromZip || 'Genève',
                to_city: data.toZip || 'Lausanne',
                details: `Calculateur: ${data.volume} m³, ${data.itemCount} meubles, ${data.disassembleCount} démontages. Message: ${data.message || 'Aucun'}`,
                amount_chf: numericPrice,
                estimated_amount_chf: numericPrice,
                status: 'nouveau'
            });
        } catch (dbErr) {
            console.warn('Batimove OS save lead from calculator notice:', dbErr);
        }

        return {
            success: true,
            message: 'Devis envoyé avec succès!'
        };
    } catch (error) {
        console.error('Error sending calculator quote:', error);
        throw new Error('Failed to send quote. Please try again.');
    }
};

/**
 * Send direct service quote from Services page via EmailJS
 */
export interface ServiceQuoteData {
    serviceName: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    date?: string;
    fromCity?: string;
    toCity?: string;
    details?: string;
}

export const submitServiceQuote = async (data: ServiceQuoteData): Promise<ApiResponse> => {
    try {
        const templateParams = {
            service_name: data.serviceName,
            service_id: data.serviceName,
            client_name: data.clientName,
            from_name: data.clientName,
            client_email: data.clientEmail,
            from_email: data.clientEmail,
            client_phone: data.clientPhone,
            from_phone: data.clientPhone,
            date: data.date || 'Non spécifiée',
            from_zip: data.fromCity || 'Non spécifié',
            to_zip: data.toCity || 'Non spécifié',
            message: `Demande de devis direct depuis la page Services:
Prestation: ${data.serviceName}
Client: ${data.clientName}
Téléphone: ${data.clientPhone}
Email: ${data.clientEmail}
Date souhaitée: ${data.date || 'Non spécifiée'}
Trajet: ${data.fromCity || 'N/A'} -> ${data.toCity || 'N/A'}
Précisions: ${data.details || 'Aucune'}`.trim(),
            to_email: 'info@batimove.ch'
        };

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_QUOTE,
            templateParams
        );

        // Also record in Batimove OS Supabase / LocalStorage
        try {
            const { saveLead } = await import('./supabaseClient');
            await saveLead({
                client_name: data.clientName,
                client_phone: data.clientPhone,
                client_email: data.clientEmail,
                service_type: data.serviceName,
                from_city: data.fromCity,
                to_city: data.toCity,
                move_date: data.date,
                details: data.details,
                estimated_amount_chf: 0,
                status: 'nouveau'
            });
        } catch (dbErr) {
            console.warn('Batimove OS save lead non-blocking notice:', dbErr);
        }

        return {
            success: true,
            message: 'Votre demande de devis a été transmise avec succès à notre équipe.'
        };
    } catch (error) {
        console.error('Error sending service quote:', error);
        throw new Error('Failed to submit quote. Please try again.');
    }
};

// Export all API functions
export const api = {
    submitQuote,
    submitContact,
    submitBusiness,
    sendQuoteEmail,
    submitServiceQuote,
};

