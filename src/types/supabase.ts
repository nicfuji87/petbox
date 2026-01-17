export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            addresses: {
                Row: {
                    city: string
                    client_id: string | null
                    complement: string | null
                    created_at: string | null
                    id: string
                    is_default: boolean | null
                    neighborhood: string | null
                    number: string
                    state: string
                    street: string
                    zip_code: string
                }
                Insert: {
                    city: string
                    client_id?: string | null
                    complement?: string | null
                    created_at?: string | null
                    id?: string
                    is_default?: boolean | null
                    neighborhood?: string | null
                    number: string
                    state: string
                    street: string
                    zip_code: string
                }
                Update: {
                    city?: string
                    client_id?: string | null
                    complement?: string | null
                    created_at?: string | null
                    id?: string
                    is_default?: boolean | null
                    neighborhood?: string | null
                    number?: string
                    state?: string
                    street?: string
                    zip_code?: string
                }
            }
            clients: {
                Row: {
                    asaas_id: string | null
                    cpf: string
                    created_at: string | null
                    email: string
                    full_name: string
                    id: string
                    phone: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    asaas_id?: string | null
                    cpf: string
                    created_at?: string | null
                    email: string
                    full_name: string
                    id?: string
                    phone?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    asaas_id?: string | null
                    cpf?: string
                    created_at?: string | null
                    email?: string
                    full_name?: string
                    id?: string
                    phone?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
            }
            integration_logs: {
                Row: {
                    action: string | null
                    created_at: string | null
                    entity_id: string | null
                    entity_type: string | null
                    error_message: string | null
                    id: string
                    payload: Json | null
                    status: string | null
                }
                Insert: {
                    action?: string | null
                    created_at?: string | null
                    entity_id?: string | null
                    entity_type?: string | null
                    error_message?: string | null
                    id?: string
                    payload?: Json | null
                    status?: string | null
                }
                Update: {
                    action?: string | null
                    created_at?: string | null
                    entity_id?: string | null
                    entity_type?: string | null
                    error_message?: string | null
                    id?: string
                    payload?: Json | null
                    status?: string | null
                }
            }
            orders: {
                Row: {
                    amount: number
                    asaas_payment_id: string | null
                    client_id: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    paid_at: string | null
                    payment_method: string | null
                    status: string | null
                    subscription_id: string | null
                }
                Insert: {
                    amount: number
                    asaas_payment_id?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    paid_at?: string | null
                    payment_method?: string | null
                    status?: string | null
                    subscription_id?: string | null
                }
                Update: {
                    amount?: number
                    asaas_payment_id?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    paid_at?: string | null
                    payment_method?: string | null
                    status?: string | null
                    subscription_id?: string | null
                }
            }
            pets: {
                Row: {
                    birth_date: string | null
                    breed: string | null
                    client_id: string | null
                    created_at: string | null
                    features: string[] | null
                    id: string
                    name: string
                    photo_url: string | null
                    size: string | null
                    type: string | null
                }
                Insert: {
                    birth_date?: string | null
                    breed?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    features?: string[] | null
                    id?: string
                    name: string
                    photo_url?: string | null
                    size?: string | null
                    type?: string | null
                }
                Update: {
                    birth_date?: string | null
                    breed?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    features?: string[] | null
                    id?: string
                    name?: string
                    photo_url?: string | null
                    size?: string | null
                    type?: string | null
                }
            }
            subscriptions: {
                Row: {
                    asaas_subscription_id: string | null
                    client_id: string | null
                    created_at: string | null
                    cycle_count: number | null
                    id: string
                    next_due_date: string | null
                    pet_id: string | null
                    plan_type: string | null
                    status: string | null
                    updated_at: string | null
                    value: number
                }
                Insert: {
                    asaas_subscription_id?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    cycle_count?: number | null
                    id?: string
                    next_due_date?: string | null
                    pet_id?: string | null
                    plan_type?: string | null
                    status?: string | null
                    updated_at?: string | null
                    value: number
                }
                Update: {
                    asaas_subscription_id?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    cycle_count?: number | null
                    id?: string
                    next_due_date?: string | null
                    pet_id?: string | null
                    plan_type?: string | null
                    status?: string | null
                    updated_at?: string | null
                    value?: number
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
