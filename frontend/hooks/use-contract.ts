
import { useEthers } from '@usedapp/core';
import { AppConfig, config } from '../config';
import { useMemo } from 'react';
import { ethers } from 'ethers';

export const useContract = (name: keyof AppConfig['abis']) => {
    const [address, abi] = useContractConfig(name);
    return useContractByAddress(address, abi);
}

export const useContractByAddress = (address: string, abi: any) => {
    return useMemo(() => {
        if (!address || !abi) return null;

        return new ethers.Contract(address, abi);
    }, [address, abi]);
}

export const useContractConfig = (name: keyof AppConfig['abis']) => {
    const { chainId } = useEthers();

    if (!chainId) return [null, null];


    if (!config.addresses[chainId] || !config.addresses[chainId][name]) {
        return [null, null];
    }

    return [
        config.addresses[chainId][name],
        config.abis[name]
    ]
}