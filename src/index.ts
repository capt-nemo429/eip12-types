export type BoxId = string;
export type TransactionId = string;
export type HexString = string;
export type ErgoTree = string;
export type TokenId = string;

export type TokenAmount = {
  tokenId: TokenId;
  amount: string;
  name?: string;
  decimals?: number;
};

export type NonMandatoryRegisters = Partial<{
  R4: HexString;
  R5: HexString;
  R6: HexString;
  R7: HexString;
  R8: HexString;
  R9: HexString;
}>;

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

export type ContextExtension =
  | {
      values: { [key: string]: string };
    }
  | {};

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
  id?: string;
  inputs: UnsignedInput[];
  dataInputs: DataInput[] | UnsignedInput[];
  outputs: BoxCandidate[];
};

export type ProverResult = {
  proofBytes: HexString;
  extension: ContextExtension;
};

export type SignedInput = Readonly<{
  boxId: BoxId;
  spendingProof: ProverResult;
}>;

export type SignedTransaction = Readonly<{
  id: TransactionId;
  inputs: SignedInput[];
  dataInputs: DataInput[];
  outputs: Box[];
}>;

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
  getContext: () => Promise<any>;
}

export interface EIP12ErgoAPI {
  get_utxos(amount?: string, tokenId?: string): Promise<Box[]>;
  get_balance(tokenId?: string): Promise<string>;
  get_used_addresses(): Promise<string[]>;
  get_unused_addresses(): Promise<string[]>;
  get_change_address(): Promise<string>;
  sign_tx(transaction: UnsignedTransaction): Promise<SignedTransaction>;
  sign_data(address: string, message: string): Promise<unknown>;
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
