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
  get_utxos(amount?: string, tokenId?: string): Promise<any[]>;
  get_balance(tokenId?: string): Promise<string>;
  get_used_addresses(): Promise<string[]>;
  get_unused_addresses(): Promise<string[]>;
  get_change_address(): Promise<string>;
  sign_tx(transaction: any): Promise<any>;
  sign_data(address: string, message: string): Promise<any>;
  submit_tx(transaction: any): Promise<any>;
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
