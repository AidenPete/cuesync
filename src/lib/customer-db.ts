import { promises as fs } from "node:fs";
import path from "node:path";
import { normalizePhone } from "@/lib/format";
import type { CustomerInput, CustomerRecord } from "@/lib/customer-types";

const CUSTOMERS_PATH = path.join(process.cwd(), "data/customers.json");

let memoryCustomers: CustomerRecord[] | null = null;

function normalizeRecord(raw: Record<string, unknown>): CustomerRecord {
  const phone = normalizePhone(String(raw.phone ?? ""));
  const now = new Date().toISOString();

  return {
    phone,
    name: String(raw.name ?? "").trim(),
    deliveryLocation: String(raw.deliveryLocation ?? "").trim(),
    notes: raw.notes ? String(raw.notes).trim() : undefined,
    createdAt: String(raw.createdAt ?? now),
    updatedAt: String(raw.updatedAt ?? now),
  };
}

async function readCustomers(): Promise<CustomerRecord[]> {
  if (memoryCustomers) return memoryCustomers;

  try {
    const raw = await fs.readFile(CUSTOMERS_PATH, "utf8");
    memoryCustomers = (JSON.parse(raw) as Record<string, unknown>[]).map(normalizeRecord);
    return memoryCustomers;
  } catch {
    memoryCustomers = memoryCustomers ?? [];
    return memoryCustomers;
  }
}

async function writeCustomers(customers: CustomerRecord[]) {
  memoryCustomers = customers;
  try {
    await fs.mkdir(path.dirname(CUSTOMERS_PATH), { recursive: true });
    await fs.writeFile(CUSTOMERS_PATH, JSON.stringify(customers, null, 2));
  } catch (error) {
    console.warn("[CueSync customers] Could not persist to disk:", error);
  }
}

export async function listCustomerRecords(): Promise<CustomerRecord[]> {
  return readCustomers();
}

export async function getCustomerRecord(
  phone: string,
): Promise<CustomerRecord | undefined> {
  const customers = await readCustomers();
  const normalized = normalizePhone(phone);
  return customers.find((customer) => customer.phone === normalized);
}

export async function saveCustomerRecord(
  input: CustomerInput,
): Promise<{ record?: CustomerRecord; error?: string }> {
  const phone = normalizePhone(input.phone);
  const name = input.name.trim();
  const deliveryLocation = String(input.deliveryLocation ?? "").trim();
  const notes = input.notes?.trim() || undefined;

  if (!name) return { error: "Name is required." };

  const customers = await readCustomers();
  if (customers.some((customer) => customer.phone === phone)) {
    return { error: "A customer with this phone number already exists." };
  }

  const now = new Date().toISOString();
  const record: CustomerRecord = {
    phone,
    name,
    deliveryLocation,
    notes,
    createdAt: now,
    updatedAt: now,
  };

  customers.unshift(record);
  await writeCustomers(customers);
  return { record };
}

export async function updateCustomerRecord(
  phone: string,
  updates: Partial<Omit<CustomerInput, "phone">>,
): Promise<{ record?: CustomerRecord; error?: string }> {
  const customers = await readCustomers();
  const normalized = normalizePhone(phone);
  const index = customers.findIndex((customer) => customer.phone === normalized);

  if (index < 0) return { error: "Customer not found." };

  const current = customers[index];
  const name =
    updates.name !== undefined ? updates.name.trim() : current.name;
  const deliveryLocation =
    updates.deliveryLocation !== undefined
      ? updates.deliveryLocation.trim()
      : current.deliveryLocation;
  const notes =
    updates.notes !== undefined ? updates.notes.trim() || undefined : current.notes;

  if (!name) return { error: "Name is required." };

  const record: CustomerRecord = {
    ...current,
    name,
    deliveryLocation,
    notes,
    updatedAt: new Date().toISOString(),
  };

  customers[index] = record;
  await writeCustomers(customers);
  return { record };
}

export async function upsertCustomerRecord(
  input: CustomerInput,
): Promise<CustomerRecord> {
  const existing = await getCustomerRecord(input.phone);
  if (existing) {
    const result = await updateCustomerRecord(input.phone, input);
    return result.record ?? existing;
  }

  const result = await saveCustomerRecord(input);
  if (result.error || !result.record) {
    throw new Error(result.error ?? "Could not save customer.");
  }
  return result.record;
}

export async function deleteCustomerRecord(phone: string): Promise<boolean> {
  const customers = await readCustomers();
  const normalized = normalizePhone(phone);
  const next = customers.filter((customer) => customer.phone !== normalized);
  if (next.length === customers.length) return false;
  await writeCustomers(next);
  return true;
}
