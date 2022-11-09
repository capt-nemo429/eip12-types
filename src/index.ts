export type BoxId = string;
export type TransactionId = string;
export type HexString = string;
export type ErgoTree = string;
export type TokenId = string;

export type TokenAmount = {
  tokenId: TokenId;
  amount: string;
};

export type AssetBalance = {
  tokenId: TokenId;
  balance: string;
};

export type NonMandatoryRegisters = {
  R4?: HexString;
  R5?: HexString;
  R6?: HexString;
  R7?: HexString;
  R8?: HexString;
  R9?: HexString;
};

export type BoxCandidate = {
  boxId?: BoxId;
  ergoTree: ErgoTree;
  creationHeight: number;
  value: string;
  assets: TokenAmount[];
  additionalRegisters: NonMandatoryRegisters;
};

export type Box = {
  boxId: BoxId;
  transactionId: TransactionId;
  index: number;
  ergoTree: ErgoTree;
  creationHeight: number;
  value: string;
  assets: TokenAmount[];
  additionalRegisters: NonMandatoryRegisters;
  confirmed?: boolean;
};

export type ContextExtension = { values?: { [key: string]: string } };

export type UnsignedInput = {
  boxId: BoxId;
  transactionId: TransactionId;
  index: number;
  ergoTree: ErgoTree;
  creationHeight: number;
  value: string;
  assets: TokenAmount[];
  additionalRegisters: NonMandatoryRegisters;
  extension: ContextExtension;
};

export type DataInput = {
  boxId: BoxId;
};

export type UnsignedTransaction = {
  id?: TransactionId;
  inputs: UnsignedInput[];
  dataInputs: UnsignedInput[];
  outputs: BoxCandidate[];
};

export type ProverResult = {
  readonly proofBytes: HexString;
  readonly extension: ContextExtension;
};

export type AuthResult = {
  signedMessage: string;
  proof: HexString;
};

export type SignedInput = {
  readonly boxId: BoxId;
  readonly spendingProof: ProverResult;
};

export type SignedTransaction = {
  readonly id: TransactionId;
  readonly inputs: SignedInput[];
  readonly dataInputs: DataInput[];
  readonly outputs: Box[];
};

export type TokenTargetAmount = {
  tokenId: string;
  amount?: string;
};

export type SelectionTarget = {
  nanoErgs?: string;
  tokens?: TokenTargetAmount[];
};

type EIP12ConnectionOptions = {
  /**
   * Specify if the wallet should instantiate a global `ergo` const with
   * the interaction API.
   */
  createErgoObject: boolean;
};

export interface EIP12Connection {
  /**
   * Request wallet connection and instantiate a global `ergo` const with
   * the interaction API, if authorized by the user.
   */
  connect(): Promise<boolean>;

  /**
   * Request wallet connection with parameters.
   * @param options connection parameters.
   */
  connect(options?: EIP12ConnectionOptions): Promise<boolean>;

  /**
   * Check if the wallet is connected.
   */
  isConnected: () => Promise<boolean>;

  /**
   * Disconnect from wallet and remove the connection in the wallet.
   */
  disconnect: () => Promise<boolean>;

  /**
   * Get a {@link EIP12ErgoAPI} instance.
   */
  getContext: () => Promise<EIP12ErgoAPI>;
}

export interface EIP12ErgoAPI {
  /**
   * Get a list of unspent boxes tracked by the wallet that it is capable of signing for.
   * @param amount
   * @param tokenId
   */
  get_utxos(amount?: string, tokenId?: string): Promise<Box[]>;

  /**
   * Get a list of unspent boxes tracked by the wallet that it is capable of signing for.
   * @param target
   */
  get_utxos(target: SelectionTarget): Promise<Box[]>;

  /**
   * Get available balance of `tokenId` owned by the wallet.
   * @param tokenId default = 'ERG'
   */
  get_balance(tokenId: string): Promise<string>;

  /**
   * Get available balance of ERG owned by the wallet.
   */
  get_balance(tokenId: "ERG"): Promise<string>;

  /**
   * Get available balance of ERG owned by the wallet.
   */
  get_balance(): Promise<string>;

  /**
   * Get available balance of all assets owned by the wallet.
   */
  get_balance(tokenId: "all"): Promise<AssetBalance[]>;

  /**
   * Get all wallet's used addresses.
   */
  get_used_addresses(): Promise<string[]>;

  /**
   * Get all wallet's unused addresses.
   */
  get_unused_addresses(): Promise<string[]>;

  /**
   * Get user's preferred change address.
   */
  get_change_address(): Promise<string>;

  /**
   * Sign a transaction using wallet's private keys.
   * @param transaction
   */
  sign_tx(transaction: UnsignedTransaction): Promise<SignedTransaction>;

  /**
   * Authenticate an address by signing a message.
   * @param address prover address
   * @param message arbitrary message
   */
  auth(address: string, message: string): Promise<AuthResult>;

  /**
   * Sign generic data using the private key associated with `address` if possible.
   * @param address
   * @param message
   */
  sign_data(address: string, message: String): Promise<unknown>;

  /** Get latest block height height */
  get_current_height(): Promise<number>;

  /**
   * Submit a signed transaction to the network.
   * @param transaction
   */
  submit_tx(transaction: SignedTransaction): Promise<string>;
}

declare global {
  /**
   * Ergo dApp Connector access class
   */
  const ergoConnector: Record<string, EIP12Connection | undefined> | undefined;

  /**
   * Ergo dApps Connector interactions API
   */
  const ergo: EIP12ErgoAPI | undefined;

  /**
   * Request wallet read access.
   *
   * @deprecated This function is deprecated and will be removed in a
   * future release. Use `ergoConnector.connect()` instead.
   */
  const ergo_request_read_access: () => Promise<boolean> | undefined;

  /**
   * Check read access.
   *
   * @deprecated This function is deprecated and will be removed in a
   * future release. Use `ergoConnector.isConnected()` instead.
   */
  const ergo_check_read_access: () => Promise<boolean> | undefined;
}
