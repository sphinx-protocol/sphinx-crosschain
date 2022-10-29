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
from contracts.starknet.lib.eip712 import EIP712
from contracts.starknet.lib.execute import execute
from contracts.starknet.lib.math_utils import MathUtils
from contracts.starnet.lib.openzeppelin.access.ownable.library import Ownable

@contract_interface
namespace IGatewayContract {
    // Submit a new bid (limit buy order) to a given market.
    func create_bid(base_asset : felt, quote_asset : felt, price : felt, amount : felt, post_only : felt) {
    }
    // Submit a new ask (limit sell order) to a given market.
    func create_ask(base_asset : felt, quote_asset : felt, price : felt, amount : felt, post_only : felt) {
    }
    // Submit a new market buy to a given market.
    func market_buy(base_asset : felt, quote_asset : felt, amount : felt) {
    }
    // Submit a new market sell to a given market.
    func market_sell(base_asset : felt, quote_asset : felt, amount : felt) {
    }
    // Delete an order and update limits, markets and balances.
    func cancel_order(order_id : felt) {
    }
}

// Stores GatewayContract address.
@storage_var
func gateway_addr() -> (addr : felt) {
}

// 1 if gateway_addr has been set, 0 otherwise
@storage_var
func is_gateway_addr_set() -> (bool : felt) {
}

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr} (owner : felt) {
    Ownable.initializer(owner);
    return ();
}

// Set GatewayContract address.
// @dev Can only be called by contract owner and is write once.
@external
func set_gateway_addr{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr} (_gateway_addr : felt) {
    Ownable.assert_only_owner();
    let (is_set) = is_gateway_addr_set.read();
    if (is_set == 0) {
        gateway_addr.write(_gateway_addr);
        is_gateway_addr_set.write(1);
        handle_revoked_refs();
    } else {
        handle_revoked_refs();
    }
    return ();
}

// Contract to allow authentication of Snapshot X users via an Ethereum signature
// @author SnapshotLabs
// @dev Authentication of an action (vote or propose) via an Ethereum signature
// @param amount is the amount of tokens
// @param strategy is the action requested. 0 is for place an order. 1 is to cancel an order and 2 is to perform a withdrawal
// @param r Signature parameter
// @param s Signature parameter
// @param v Signature parameter
// @param salt Signature salt
// @param target Address of the space contract
// @param function_selector Function selector of the action
// @param calldata Calldata array required for the action
@external
func authenticate{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}(
    price: felt,
    amount: felt,
    strategy: felt,
    r: Uint256,
    s: Uint256,
    v: felt,
    salt: Uint256,
    market: felt,
    calldata_len: felt,
    calldata: felt*,
) -> () {
    // verify the signature
    EIP712.verify_signed_message(price, amount, strategy, r, s, v, salt, market, calldata_len, calldata);

    // Limit buy with post-only mode disabled
    if (strategy == 0) {
        let (_gateway_addr) = gateway_addr.read();
        IGatewayContract.create_bid();
    }

    if (strategy == 1) {
    // TODO: 
    }

    if (strategy == 2) {
    // TODO: 
    }

    return ();
}