/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleReader, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Certificate$Data = {
    $$type: 'Certificate$Data';
    collection_address: Address;
    item_index: bigint;
    is_initialized: boolean;
    owner: Address | null;
    individual_content: Cell | null;
}

export function storeCertificate$Data(src: Certificate$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeInt(src.item_index, 257);
        b_0.storeBit(src.is_initialized);
        b_0.storeAddress(src.owner);
        if (src.individual_content !== null && src.individual_content !== undefined) { b_0.storeBit(true).storeRef(src.individual_content); } else { b_0.storeBit(false); }
    };
}

export function loadCertificate$Data(slice: Slice) {
    const sc_0 = slice;
    const _collection_address = sc_0.loadAddress();
    const _item_index = sc_0.loadIntBig(257);
    const _is_initialized = sc_0.loadBit();
    const _owner = sc_0.loadMaybeAddress();
    const _individual_content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'Certificate$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function loadTupleCertificate$Data(source: TupleReader) {
    const _collection_address = source.readAddress();
    const _item_index = source.readBigNumber();
    const _is_initialized = source.readBoolean();
    const _owner = source.readAddressOpt();
    const _individual_content = source.readCellOpt();
    return { $$type: 'Certificate$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function loadGetterTupleCertificate$Data(source: TupleReader) {
    const _collection_address = source.readAddress();
    const _item_index = source.readBigNumber();
    const _is_initialized = source.readBoolean();
    const _owner = source.readAddressOpt();
    const _individual_content = source.readCellOpt();
    return { $$type: 'Certificate$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function storeTupleCertificate$Data(source: Certificate$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.collection_address);
    builder.writeNumber(source.item_index);
    builder.writeBoolean(source.is_initialized);
    builder.writeAddress(source.owner);
    builder.writeCell(source.individual_content);
    return builder.build();
}

function dictValueParserCertificate$Data(): DictionaryValue<Certificate$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCertificate$Data(src)).endCell());
        },
        parse: (src) => {
            return loadCertificate$Data(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner_address);
    };
}

export function loadCollectionData(slice: Slice) {
    const sc_0 = slice;
    const _next_item_index = sc_0.loadIntBig(257);
    const _collection_content = sc_0.loadRef();
    const _owner_address = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function loadTupleCollectionData(source: TupleReader) {
    const _next_item_index = source.readBigNumber();
    const _collection_content = source.readCell();
    const _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function loadGetterTupleCollectionData(source: TupleReader) {
    const _next_item_index = source.readBigNumber();
    const _collection_content = source.readCell();
    const _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function storeTupleCollectionData(source: CollectionData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.collection_content);
    builder.writeAddress(source.owner_address);
    return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    query_id: bigint;
    new_owner: Address | null;
    response_destination: Address | null;
    custom_payload: Cell;
    forward_amount: bigint | null;
    forward_payload: Cell | null;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.new_owner);
        b_0.storeAddress(src.response_destination);
        b_0.storeRef(src.custom_payload);
        if (src.forward_amount !== null && src.forward_amount !== undefined) { b_0.storeBit(true).storeCoins(src.forward_amount); } else { b_0.storeBit(false); }
        if (src.forward_payload !== null && src.forward_payload !== undefined) { b_0.storeBit(true).storeRef(src.forward_payload); } else { b_0.storeBit(false); }
    };
}

export function loadTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _new_owner = sc_0.loadMaybeAddress();
    const _response_destination = sc_0.loadMaybeAddress();
    const _custom_payload = sc_0.loadRef();
    const _forward_amount = sc_0.loadBit() ? sc_0.loadCoins() : null;
    const _forward_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadTupleTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _new_owner = source.readAddressOpt();
    const _response_destination = source.readAddressOpt();
    const _custom_payload = source.readCell();
    const _forward_amount = source.readBigNumberOpt();
    const _forward_payload = source.readCellOpt();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadGetterTupleTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _new_owner = source.readAddressOpt();
    const _response_destination = source.readAddressOpt();
    const _custom_payload = source.readCell();
    const _forward_amount = source.readBigNumberOpt();
    const _forward_payload = source.readCellOpt();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function storeTupleTransfer(source: Transfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.new_owner);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_amount);
    builder.writeCell(source.forward_payload);
    return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type Excesses = {
    $$type: 'Excesses';
    query_id: bigint;
}

export function storeExcesses(src: Excesses) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadExcesses(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadGetterTupleExcesses(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadGetterTupleGetStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index_id: bigint;
    collection: Address;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.index_id, 257);
        b_0.storeAddress(src.collection);
    };
}

export function loadReportStaticData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _index_id = sc_0.loadIntBig(257);
    const _collection = sc_0.loadAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function loadTupleReportStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _index_id = source.readBigNumber();
    const _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function loadGetterTupleReportStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _index_id = source.readBigNumber();
    const _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function storeTupleReportStaticData(source: ReportStaticData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index_id);
    builder.writeAddress(source.collection);
    return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    }
}

export type GetNftData = {
    $$type: 'GetNftData';
    is_initialized: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}

export function storeGetNftData(src: GetNftData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.is_initialized);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.individual_content);
    };
}

export function loadGetNftData(slice: Slice) {
    const sc_0 = slice;
    const _is_initialized = sc_0.loadBit();
    const _index = sc_0.loadIntBig(257);
    const _collection_address = sc_0.loadAddress();
    const _owner_address = sc_0.loadAddress();
    const _individual_content = sc_0.loadRef();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function loadTupleGetNftData(source: TupleReader) {
    const _is_initialized = source.readBoolean();
    const _index = source.readBigNumber();
    const _collection_address = source.readAddress();
    const _owner_address = source.readAddress();
    const _individual_content = source.readCell();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function loadGetterTupleGetNftData(source: TupleReader) {
    const _is_initialized = source.readBoolean();
    const _index = source.readBigNumber();
    const _collection_address = source.readAddress();
    const _owner_address = source.readAddress();
    const _individual_content = source.readCell();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function storeTupleGetNftData(source: GetNftData) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.is_initialized);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection_address);
    builder.writeAddress(source.owner_address);
    builder.writeCell(source.individual_content);
    return builder.build();
}

function dictValueParserGetNftData(): DictionaryValue<GetNftData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetNftData(src)).endCell());
        },
        parse: (src) => {
            return loadGetNftData(src.loadRef().beginParse());
        }
    }
}

export type UpdateCourse = {
    $$type: 'UpdateCourse';
    content: Cell;
    cost: bigint;
}

export function storeUpdateCourse(src: UpdateCourse) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(473948970, 32);
        b_0.storeRef(src.content);
        b_0.storeCoins(src.cost);
    };
}

export function loadUpdateCourse(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 473948970) { throw Error('Invalid prefix'); }
    const _content = sc_0.loadRef();
    const _cost = sc_0.loadCoins();
    return { $$type: 'UpdateCourse' as const, content: _content, cost: _cost };
}

function loadTupleUpdateCourse(source: TupleReader) {
    const _content = source.readCell();
    const _cost = source.readBigNumber();
    return { $$type: 'UpdateCourse' as const, content: _content, cost: _cost };
}

function loadGetterTupleUpdateCourse(source: TupleReader) {
    const _content = source.readCell();
    const _cost = source.readBigNumber();
    return { $$type: 'UpdateCourse' as const, content: _content, cost: _cost };
}

function storeTupleUpdateCourse(source: UpdateCourse) {
    const builder = new TupleBuilder();
    builder.writeCell(source.content);
    builder.writeNumber(source.cost);
    return builder.build();
}

function dictValueParserUpdateCourse(): DictionaryValue<UpdateCourse> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateCourse(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateCourse(src.loadRef().beginParse());
        }
    }
}

export type CertificateIssue = {
    $$type: 'CertificateIssue';
    certificate_address: Address;
    certificate_content: Cell;
}

export function storeCertificateIssue(src: CertificateIssue) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3158009221, 32);
        b_0.storeAddress(src.certificate_address);
        b_0.storeRef(src.certificate_content);
    };
}

export function loadCertificateIssue(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3158009221) { throw Error('Invalid prefix'); }
    const _certificate_address = sc_0.loadAddress();
    const _certificate_content = sc_0.loadRef();
    return { $$type: 'CertificateIssue' as const, certificate_address: _certificate_address, certificate_content: _certificate_content };
}

function loadTupleCertificateIssue(source: TupleReader) {
    const _certificate_address = source.readAddress();
    const _certificate_content = source.readCell();
    return { $$type: 'CertificateIssue' as const, certificate_address: _certificate_address, certificate_content: _certificate_content };
}

function loadGetterTupleCertificateIssue(source: TupleReader) {
    const _certificate_address = source.readAddress();
    const _certificate_content = source.readCell();
    return { $$type: 'CertificateIssue' as const, certificate_address: _certificate_address, certificate_content: _certificate_content };
}

function storeTupleCertificateIssue(source: CertificateIssue) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.certificate_address);
    builder.writeCell(source.certificate_content);
    return builder.build();
}

function dictValueParserCertificateIssue(): DictionaryValue<CertificateIssue> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCertificateIssue(src)).endCell());
        },
        parse: (src) => {
            return loadCertificateIssue(src.loadRef().beginParse());
        }
    }
}

export type Enrollment = {
    $$type: 'Enrollment';
    student_info: Cell;
}

export function storeEnrollment(src: Enrollment) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(567151410, 32);
        b_0.storeRef(src.student_info);
    };
}

export function loadEnrollment(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 567151410) { throw Error('Invalid prefix'); }
    const _student_info = sc_0.loadRef();
    return { $$type: 'Enrollment' as const, student_info: _student_info };
}

function loadTupleEnrollment(source: TupleReader) {
    const _student_info = source.readCell();
    return { $$type: 'Enrollment' as const, student_info: _student_info };
}

function loadGetterTupleEnrollment(source: TupleReader) {
    const _student_info = source.readCell();
    return { $$type: 'Enrollment' as const, student_info: _student_info };
}

function storeTupleEnrollment(source: Enrollment) {
    const builder = new TupleBuilder();
    builder.writeCell(source.student_info);
    return builder.build();
}

function dictValueParserEnrollment(): DictionaryValue<Enrollment> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEnrollment(src)).endCell());
        },
        parse: (src) => {
            return loadEnrollment(src.loadRef().beginParse());
        }
    }
}

export type Quiz = {
    $$type: 'Quiz';
    quizId: bigint;
    answers: Cell;
}

export function storeQuiz(src: Quiz) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2557830277, 32);
        b_0.storeUint(src.quizId, 8);
        b_0.storeRef(src.answers);
    };
}

export function loadQuiz(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2557830277) { throw Error('Invalid prefix'); }
    const _quizId = sc_0.loadUintBig(8);
    const _answers = sc_0.loadRef();
    return { $$type: 'Quiz' as const, quizId: _quizId, answers: _answers };
}

function loadTupleQuiz(source: TupleReader) {
    const _quizId = source.readBigNumber();
    const _answers = source.readCell();
    return { $$type: 'Quiz' as const, quizId: _quizId, answers: _answers };
}

function loadGetterTupleQuiz(source: TupleReader) {
    const _quizId = source.readBigNumber();
    const _answers = source.readCell();
    return { $$type: 'Quiz' as const, quizId: _quizId, answers: _answers };
}

function storeTupleQuiz(source: Quiz) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.quizId);
    builder.writeCell(source.answers);
    return builder.build();
}

function dictValueParserQuiz(): DictionaryValue<Quiz> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeQuiz(src)).endCell());
        },
        parse: (src) => {
            return loadQuiz(src.loadRef().beginParse());
        }
    }
}

export type CourseData = {
    $$type: 'CourseData';
    course_index: bigint;
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
    cost: bigint;
}

export function storeCourseData(src: CourseData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.course_index, 16);
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner_address);
        b_0.storeCoins(src.cost);
    };
}

export function loadCourseData(slice: Slice) {
    const sc_0 = slice;
    const _course_index = sc_0.loadUintBig(16);
    const _next_item_index = sc_0.loadIntBig(257);
    const _collection_content = sc_0.loadRef();
    const _owner_address = sc_0.loadAddress();
    const _cost = sc_0.loadCoins();
    return { $$type: 'CourseData' as const, course_index: _course_index, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address, cost: _cost };
}

function loadTupleCourseData(source: TupleReader) {
    const _course_index = source.readBigNumber();
    const _next_item_index = source.readBigNumber();
    const _collection_content = source.readCell();
    const _owner_address = source.readAddress();
    const _cost = source.readBigNumber();
    return { $$type: 'CourseData' as const, course_index: _course_index, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address, cost: _cost };
}

function loadGetterTupleCourseData(source: TupleReader) {
    const _course_index = source.readBigNumber();
    const _next_item_index = source.readBigNumber();
    const _collection_content = source.readCell();
    const _owner_address = source.readAddress();
    const _cost = source.readBigNumber();
    return { $$type: 'CourseData' as const, course_index: _course_index, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address, cost: _cost };
}

function storeTupleCourseData(source: CourseData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.course_index);
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.collection_content);
    builder.writeAddress(source.owner_address);
    builder.writeNumber(source.cost);
    return builder.build();
}

function dictValueParserCourseData(): DictionaryValue<CourseData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCourseData(src)).endCell());
        },
        parse: (src) => {
            return loadCourseData(src.loadRef().beginParse());
        }
    }
}

export type Course$Data = {
    $$type: 'Course$Data';
    course_index: bigint;
    next_item_index: bigint;
    collection_content: Cell;
    owner: Address;
    cost: bigint;
}

export function storeCourse$Data(src: Course$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.course_index, 16);
        b_0.storeUint(src.next_item_index, 32);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.cost);
    };
}

export function loadCourse$Data(slice: Slice) {
    const sc_0 = slice;
    const _course_index = sc_0.loadUintBig(16);
    const _next_item_index = sc_0.loadUintBig(32);
    const _collection_content = sc_0.loadRef();
    const _owner = sc_0.loadAddress();
    const _cost = sc_0.loadCoins();
    return { $$type: 'Course$Data' as const, course_index: _course_index, next_item_index: _next_item_index, collection_content: _collection_content, owner: _owner, cost: _cost };
}

function loadTupleCourse$Data(source: TupleReader) {
    const _course_index = source.readBigNumber();
    const _next_item_index = source.readBigNumber();
    const _collection_content = source.readCell();
    const _owner = source.readAddress();
    const _cost = source.readBigNumber();
    return { $$type: 'Course$Data' as const, course_index: _course_index, next_item_index: _next_item_index, collection_content: _collection_content, owner: _owner, cost: _cost };
}

function loadGetterTupleCourse$Data(source: TupleReader) {
    const _course_index = source.readBigNumber();
    const _next_item_index = source.readBigNumber();
    const _collection_content = source.readCell();
    const _owner = source.readAddress();
    const _cost = source.readBigNumber();
    return { $$type: 'Course$Data' as const, course_index: _course_index, next_item_index: _next_item_index, collection_content: _collection_content, owner: _owner, cost: _cost };
}

function storeTupleCourse$Data(source: Course$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.course_index);
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.collection_content);
    builder.writeAddress(source.owner);
    builder.writeNumber(source.cost);
    return builder.build();
}

function dictValueParserCourse$Data(): DictionaryValue<Course$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCourse$Data(src)).endCell());
        },
        parse: (src) => {
            return loadCourse$Data(src.loadRef().beginParse());
        }
    }
}

 type Course_init_args = {
    $$type: 'Course_init_args';
    owner: Address;
    id: bigint;
}

function initCourse_init_args(src: Course_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.id, 257);
    };
}

async function Course_init(owner: Address, id: bigint) {
    const __code = Cell.fromHex('b5ee9c724102290100097c000114ff00f4a413f4bcf2c80b01020162021103dad0eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019dd30fd31fd4fa40fa0055406c158eabfa40810101d7005902d10170822009184e72a000f8425240c705f2e0848200bf6023c2fff2f48810344033e206925f06e024d749c21fe30004f90127030e04d004d31f2182101c3fe32aba8fd2365b03d4fa005932f8425240c705f2e0848200bf5d22820a625a00bcf2f4811947882201f90001f900bdf2f48813154440f84201706ddb3cc87f01ca0055405045cb0f12cb1fcc01cf1601fa02c9ed54db31e021821021ce0b32ba27040507003e00000000436f757273652075706461746564207375636365737366756c6c7901f06d6d226eb3995b206ef2d0806f22019132e2f8416f24135f03f8276f1001a18209312d00b98e478209312d0070fb02102470030481008250231036552212c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00e010247003048042502306006a1036552212c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0003d28f5b31d40131f8416f2430328200ca2a5328bef2f42410560447135086db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d08209312d00707370f842410d6d016d6de0018210bc3b6585bae3020417080c02fcc8555082105fcc3d145007cb1f15cb3f5003206e95307001cb0192cf16e201206e95307001cb0192cf16e2cc216eb3977f01ca0001fa02947032ca00e2216eb3957f01ca00cc947032ca00e2c910364540103b591036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb0002a4090a001a58cf8680cf8480f400f400cf8101bc5154a1717088103410231029036d50536d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004404c87f01ca0055405045cb0f12cb1fcc01cf1601fa02c9ed54db310b006000000000596f7520617265207375636365737366756c6c7920656e726f6c6c656420696e2074686520636f757273652101fefa40d45932f8425260c705f2e0848209312d0070737150056d6d586d6dc8555082105fcc3d145007cb1f15cb3f5003206e95307001cb0192cf16e201206e95307001cb0192cf16e2cc216eb3977f01ca0001fa02947032ca00e2216eb3957f01ca00cc947032ca00e2c910344130146d50436d5033c8cf8580ca00cf8440ce0d008401fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004034c87f01ca0055405045cb0f12cb1fcc01cf1601fa02c9ed54db31015482f0677e8cc293f605b4e5b43b49d699b421f79482f729bfebab40fe728d7a2d3d91bae3025f05f2c0820f01d4f8425240c705f2e084820a625a0070fb02708306708827553010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004034c87f01ca0055405045cb0f12cb1fcc01cf1601fa02c9ed5410004a000000005769746864726177616c20636f6d706c65746564207375636365737366756c6c79020120122302012013150295b8b5ded44d0d200019dd30fd31fd4fa40fa0055406c158eabfa40810101d7005902d10170822009184e72a000f8425240c705f2e0848200bf6023c2fff2f48810344033e25514db3c6c51827140002310295ba7a3ed44d0d200019dd30fd31fd4fa40fa0055406c158eabfa40810101d7005902d10170822009184e72a000f8425240c705f2e0848200bf6023c2fff2f48810344033e25504db3c6c5182716015edb3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0170126f8280188c87001ca005a59cf16810101cf00c9180114ff00f4a413f4bcf2c80b190201621a2102f6d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e27fa40810101d700d20020d70b01c30093fa40019472d7216de201d2000191d4926d01e255406c158e1afa40810101d7005902d1016d6d8147c6f8425250c705f2f47059e206925f06e004d70d1ff2e0822182102fcb26a2bae302211b1c01d431d33f0131f8416f2410235f037080407f543467c8552082108b7717355004cb1f12cb3f810101cf0001cf16c91034413010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0040342003e082105fcc3d14ba8f57313504d33f20d70b01c30093fa40019472d7216de20120d70b01c30093fa40019472d7216de201d4d2000192fa00926d01e2d2000191d4926d01e2555010235f0333812155f8425260c705f2f421c000923134e30e4430e001821098756485bae3025f06f2c0821d201f01a630c0018ecd347f8209312d0070fb0223206ef2d080708306708810246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0004de1e008000000000436f6e67726174756c6174696f6e732120596f752068617665207375636365737366756c6c7920636f6d706c657465642074686520636f757273652101a4d307d45932f8425260216e925b7092c705e2f2e084812e94f8416f24135f038209312d00bef2f401c8598210987564855003cb1fcb07ccc9c88258c000000000000000000000000101cb67ccc970fb004034200064c87f01ca0055405054cf1612810101cf00ca0058206e95307001cb0192cf16e2216eb3957f01ca00cc947032ca00e2c9ed5401a5a11f9fda89a1a400031c4ff481020203ae01a40041ae1603860127f4800328e5ae42dbc403a4000323a924da03c4aa80d82b1c35f481020203ae00b205a202dadb028f8df084a4a18e0be5e8e0b3c5b678d8ab22002421206ef2d08021206ef2d08024544630285902014824260291b60b7da89a1a400033ba61fa63fa9f481f400aa80d82b1d57f481020203ae00b205a202e1044012309ce54001f084a4818e0be5c10904017ec04785ffe5e91020688067c5b678d8a70272500065473210291b7ae3da89a1a400033ba61fa63fa9f481f400aa80d82b1d57f481020203ae00b205a202e1044012309ce54001f084a4818e0be5c10904017ec04785ffe5e91020688067c5b678d8ab027280000000a5474325343ce408431');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initCourse_init_args({ $$type: 'Course_init_args', owner, id })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const Course_errors = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough Toncoin` },
    38: { message: `Not enough extra currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid standard address` },
    138: { message: `Not a basechain address` },
    6471: { message: `Content must not be empty` },
    8533: { message: `Certificate ownership is permanent` },
    11924: { message: `Minimum value is 0.02` },
    18374: { message: `Sender must be from the collection` },
    48989: { message: `Minimum cost is 0.04` },
    48992: { message: `ID must not be negative` },
    51754: { message: `Insufficient funds` },
} as const

export const Course_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Content must not be empty": 6471,
    "Certificate ownership is permanent": 8533,
    "Minimum value is 0.02": 11924,
    "Sender must be from the collection": 18374,
    "Minimum cost is 0.04": 48989,
    "ID must not be negative": 48992,
    "Insufficient funds": 51754,
} as const

const Course_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Certificate$Data","header":null,"fields":[{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"new_owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":true}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":false}},{"name":"forward_amount","type":{"kind":"simple","type":"uint","optional":true,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Excesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportStaticData","header":2339837749,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GetNftData","header":null,"fields":[{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"UpdateCourse","header":473948970,"fields":[{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"cost","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"CertificateIssue","header":3158009221,"fields":[{"name":"certificate_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"certificate_content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Enrollment","header":567151410,"fields":[{"name":"student_info","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Quiz","header":2557830277,"fields":[{"name":"quizId","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"answers","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CourseData","header":null,"fields":[{"name":"course_index","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"next_item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"cost","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"Course$Data","header":null,"fields":[{"name":"course_index","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"next_item_index","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"cost","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
]

const Course_opcodes = {
    "Transfer": 1607220500,
    "Excesses": 3576854235,
    "GetStaticData": 801842850,
    "ReportStaticData": 2339837749,
    "UpdateCourse": 473948970,
    "CertificateIssue": 3158009221,
    "Enrollment": 567151410,
    "Quiz": 2557830277,
}

const Course_getters: ABIGetter[] = [
    {"name":"get_collection_data","methodId":102491,"arguments":[],"returnType":{"kind":"simple","type":"CollectionData","optional":false}},
    {"name":"get_course_data","methodId":114033,"arguments":[],"returnType":{"kind":"simple","type":"CourseData","optional":false}},
    {"name":"get_nft_address_by_index","methodId":92067,"arguments":[{"name":"item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"get_nft_content","methodId":68445,"arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":false}}],"returnType":{"kind":"simple","type":"cell","optional":false}},
]

export const Course_getterMapping: { [key: string]: string } = {
    'get_collection_data': 'getGetCollectionData',
    'get_course_data': 'getGetCourseData',
    'get_nft_address_by_index': 'getGetNftAddressByIndex',
    'get_nft_content': 'getGetNftContent',
}

const Course_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"UpdateCourse"}},
    {"receiver":"internal","message":{"kind":"text","text":"Withdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Enrollment"}},
    {"receiver":"internal","message":{"kind":"typed","type":"CertificateIssue"}},
]

export const minTonsForStorage = 20000000n;
export const gasConsumption = 20000000n;

export class Course implements Contract {
    
    public static readonly storageReserve = 20000000n;
    public static readonly errors = Course_errors_backward;
    public static readonly opcodes = Course_opcodes;
    
    static async init(owner: Address, id: bigint) {
        return await Course_init(owner, id);
    }
    
    static async fromInit(owner: Address, id: bigint) {
        const __gen_init = await Course_init(owner, id);
        const address = contractAddress(0, __gen_init);
        return new Course(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new Course(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Course_types,
        getters: Course_getters,
        receivers: Course_receivers,
        errors: Course_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: UpdateCourse | "Withdraw" | Enrollment | CertificateIssue) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UpdateCourse') {
            body = beginCell().store(storeUpdateCourse(message)).endCell();
        }
        if (message === "Withdraw") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Enrollment') {
            body = beginCell().store(storeEnrollment(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CertificateIssue') {
            body = beginCell().store(storeCertificateIssue(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetCollectionData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_collection_data', builder.build())).stack;
        const result = loadGetterTupleCollectionData(source);
        return result;
    }
    
    async getGetCourseData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_course_data', builder.build())).stack;
        const result = loadGetterTupleCourseData(source);
        return result;
    }
    
    async getGetNftAddressByIndex(provider: ContractProvider, item_index: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(item_index);
        const source = (await provider.get('get_nft_address_by_index', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    
    async getGetNftContent(provider: ContractProvider, index: bigint, individual_content: Cell) {
        const builder = new TupleBuilder();
        builder.writeNumber(index);
        builder.writeCell(individual_content);
        const source = (await provider.get('get_nft_content', builder.build())).stack;
        const result = source.readCell();
        return result;
    }
    
}