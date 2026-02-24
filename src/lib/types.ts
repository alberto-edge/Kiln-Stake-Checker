export interface NrrGrr {
  nrr: number;
  grr: number;
}

export interface StakeStructure {
  pool: string;
  pool_address: string;
  share: number;
}

export interface Stake {
  owner: string;
  integration: string;
  integration_address: string;
  balance: string;
  shares_balance: string;
  rewards: string;
  nrr: number;
  grr: number;
  one_year?: NrrGrr;
  six_months?: NrrGrr;
  three_months?: NrrGrr;
  one_month?: NrrGrr;
  one_week?: NrrGrr;
  structure?: StakeStructure[];
  delegated_block?: number;
  delegated_at?: string;
  updated_at?: string;
}

export interface Reward {
  date: string;
  rewards: string;
  balance: string;
  nrr: number;
  rewards_usd?: number;
  balance_usd?: number;
}

export interface Operation {
  id: string;
  owner: string;
  time: string;
  block: number;
  tx_hash: string;
  type: "deposit" | "exit" | "claim";
  amount?: string;
  amount_shares?: string;
  ticket_id?: string;
  ticket_status?: string;
  size?: string;
  size_shares?: string;
  claimable?: string;
  claimed?: string;
  remaining?: string;
}

export interface ExitTicket {
  owner: string;
  state: "fulfillable" | "unfulfillable" | "partially_fulfillable";
  retrievable_amount: string;
  exiting_amount: string;
  exit_queue_address: string | null;
  integration_address: string;
  ticket_id: string;
  cask_id: string | null;
  estimated_claimable_at: number | null;
}

export interface NetworkStats {
  address: string;
  name: string;
  symbol: string;
  fee: number;
  total_supply: string;
  total_underlying_supply: string;
  total_stakers: number;
  nrr: number;
  grr: number;
  one_year?: NrrGrr;
  six_months?: NrrGrr;
  three_months?: NrrGrr;
  one_month?: NrrGrr;
  one_week?: NrrGrr;
  pools?: {
    address: string;
    name: string;
    ratio: number;
    commission: number;
    total_deposited: string;
    factory_address: string;
    operator_address: string;
  }[];
}
