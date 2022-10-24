%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import assert_lt_felt, assert_le
from starkware.starknet.common.messages import send_message_to_l1

@event
func log_notify_L1_contract(user_address : felt, token_address: felt, amount: felt, block_number: felt){
}

# Notify remote Ethereum withdrawal contract
func notify_L1_remote_contract{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(user_address: felt, token_address: felt, amount: felt){
    let (gateway_addr) = L1_gateway_address.read();
    let (block_number) = get_block_number();

    // TODO: check that user has enough tokens
    let (message_payload : felt*) = alloc();
    assert message_payload[0] = user_address;
    assert message_payload[1] = token_address;
    assert message_payload[2] = amount;
    assert message_payload[3] = block_number;

    send_message_to_l1(
        to_address=gateway_addr,
        payload_size=4,
        payload=message_payload,
    );

    log_notify_L1_contract.emit(user_address, token_address, amount, block_number);

    return ();
}

# Consume from remote Ethereum deposit contract

@l1_handler
func consume_l1_remote_contract{
    syscall_ptr: felt
}