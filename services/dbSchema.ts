/**
 * Batimove OS - Neon Serverless Postgres + Drizzle ORM Schema
 * Standard Swiss Enterprise ERP / CRM
 * Designed for migration from Supabase to Neon Postgres
 */

import { pgTable, text, numeric, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// 1. Leads & Quote Funnel Table
export const leads = pgTable('leads', {
  id: text('id').primaryKey(), // e.g. BM-2026-084
  clientName: text('client_name').notNull(),
  clientPhone: text('client_phone').notNull(),
  clientEmail: text('client_email'),
  serviceType: text('service_type').notNull().default('Déménagement Résidentiel'),
  fromCity: text('from_city').default('Genève'),
  toCity: text('to_city').default('Genève'),
  moveDate: text('move_date').default('Mars 2026'),
  details: text('details'),
  amountChf: numeric('amount_chf', { precision: 12, scale: 2 }).notNull().default('0.00'),
  estimatedAmountChf: numeric('estimated_amount_chf', { precision: 12, scale: 2 }).notNull().default('0.00'),
  status: text('status').notNull().default('nouveau'), // nouveau, visite, en_cours, confirme, facture, annule
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 2. Financial Records & Swiss VAT Table (Bexio / Winbiz compliant)
export const financialRecords = pgTable('financial_records', {
  id: text('id').primaryKey(),
  recordDate: text('record_date').notNull(), // DD.MM.YYYY
  type: text('type').notNull(), // 'revenu' | 'depense'
  category: text('category').notNull(), // demenagement, debarras, carburant, assurance, salaires
  description: text('description').notNull(),
  amountChf: numeric('amount_chf', { precision: 12, scale: 2 }).notNull().default('0.00'),
  tvaRate: numeric('tva_rate', { precision: 4, scale: 2 }).notNull().default('8.10'), // 8.1% Swiss VAT
  clientOrSupplier: text('client_or_supplier'),
  invoiceRef: text('invoice_ref'), // e.g. FAC-2026-042
  status: text('status').notNull().default('paye'), // 'paye' | 'en_attente'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 3. Logistics & Fleet Table
export const fleetVehicles = pgTable('fleet_vehicles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // Iveco Daily 30m3 (GE-4921)
  driver: text('driver').notNull(),
  capacity: text('capacity').notNull(),
  status: text('status').notNull().default('Disponible'), // En mission, Disponible, Réservé, Entretien
  city: text('city').default('Genève'),
  nextMission: text('next_mission'),
  team: text('team'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 4. Team Members & RBAC Directory Table
export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  avatarBg: text('avatar_bg').notNull(),
  initials: text('initials').notNull(),
  pinHash: text('pin_hash').notNull(),
  permissions: jsonb('permissions').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export type LeadSelect = typeof leads.$inferSelect;
export type LeadInsert = typeof leads.$inferInsert;
export type FinancialRecordSelect = typeof financialRecords.$inferSelect;
export type FinancialRecordInsert = typeof financialRecords.$inferInsert;
