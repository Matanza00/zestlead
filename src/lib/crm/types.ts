// src/lib/crm/types.ts
export type ProviderKey =
  | 'AIRTABLE'
  | 'HUBSPOT'
  | 'SALESFORCE'
  | 'ZAPIER'
  | 'ZOHO'
  | 'INSIGHTLY'
  | 'APPTIVO';

export type NormalizedRow = Record<string, any>;
