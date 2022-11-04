// SPDX-License-Identifier: MIT

%lang starknet

from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_secp.signature import verify_eth_signature_uint256
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_keccak.keccak import (
    keccak_add_uint256s,
    keccak_bigend,
    finalize_keccak,
)
from contracts.starknet.utils.handle_revoked_refs import handle_revoked_refs
from contracts.starknet.lib.EIP712 import EIP712
from contracts.starknet.lib.execute import execute
from contracts.starknet.lib.math_utils import MathUtils
from contracts.starknet.lib.openzeppelin.access.ownable.library import Ownable

const ETH_GOERLI_CHAIN_ID = 1; // To replace by sending from L1 side

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr} () {
    return ();
}

@storage_var
func counter() -> (counter : felt){
}

@view
func view_counter{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}() -> (currentCount: felt){
    let (currentCount) = counter.read();
    return (currentCount=currentCount);
}

// Contract to authenticate EIP-712 signature from Ethereum for remote access to the DEX.
// @param price : price of order
// @param amount : order size in terms of number of tokens
// @param strategy : action requested (see enum below)
// @param chainId : ID of chain where message signature originated
// @param orderId : order ID for cancel_order (left blank otherwise)
// @param r : signature parameter
// @param s : signature parameter
// @param v : signature parameter
// @param salt : signature salt
// @param base_token : felt representation of base asset token address (or token to be withdrawn)
// @param calldata_len : length of calldata array
// @param calldata : calldata array
//        calldata[0] : user_address, the address of the EOA signing the message
//        calldata[1] : quote_asset, felt representation of quote asset token address (left blank for withdraws)
@external
func authenticate{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}(
    price: felt,
    amount: felt,
    strategy: felt,
    chainId: felt,
    orderId: felt,
    r: Uint256,
    s: Uint256,
    v: felt,
    salt: Uint256,
    base_asset: felt,
    calldata_len: felt,
    calldata: felt*,
) -> () {
    alloc_locals;
    // verify the signature
    EIP712.verify_signed_message(price, amount, strategy, chainId, orderId, r, s, v, salt, base_asset, calldata_len, calldata);
    let (currentCount) = counter.read();
    counter.write(currentCount + 1);
    return ();
}

