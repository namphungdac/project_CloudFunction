import * as ethers from "ethers";
import {encrypt} from "./crypto"
import * as referralCodes from "referral-codes";

export const createAndEncryptWallet = async (
    encryptPassphrase :string
): Promise<{
    encryptedWallet: string,
    address: string
}> => {
    const wallet = ethers.Wallet.createRandom();
    return {
        encryptedWallet: encrypt(wallet.privateKey, encryptPassphrase),
        address: wallet.address.toString().toLowerCase()
    };
};

export function generateReferralCode(numberCode: number = 3): string[] {
    const codes = referralCodes.generate({
        length: 10,
        count: numberCode,
        prefix: "pt-",
    });
    return codes.map((code) => code.toLowerCase());
}
