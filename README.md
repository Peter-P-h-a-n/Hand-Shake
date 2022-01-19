# HandShake Demo - DEVERA BLOCKATHON 2021

- Website: https://deverablockathon.devpost.com/
- Demo: https://handshake-contract.live/
- Video demo: https://youtu.be/aDC24cdaP7Q

## The story

More and more people want to become a freelancer, especially in this pandemic. But, when the freelancer sent their work (designs, files, …) the employer just disappear suddenly **without** any payment back to the freelancer. 

So, we intend to build a `FREELANCER SOCIAL MEDIA` where employers and freelancers can connect and have their own contracts to **protect** their benefits by using the deposit mechanism on the ICON network. 

**The basic flow:**

+ Both **E** and **F** have to deposit the amount of ICX when they decided to join the contract by signing their signatures.
+ **E**’s deposit will be sent to **F** and **F**’s deposit will be refunded back automatically by SC when both sides have done their work and all agree with the result. => the contract ends

**Target users:** Employers in **small/short contracts** with **individual freelances** who have less benefits **PROTECTION** on their work **all around the world**. 

So, the **motivation** for users to use this platform is that If you don’t cheat/hack/scam and follow the contract closely as your roles (employer/freelancer), you’ll get **exactly** what you want: 

+ Employer: designs / files
+ Freelancer: Money

Otherwise, your deposit and working results might be **locked** until the contract conflict has been solved by other mechanisms.

## Wireframes

https://docs.google.com/presentation/d/1q9M0hxGXIKwOsJcErd0MXllAiF1rMgUZAO-ba_gCfV8/edit?usp=sharing

## Wallets

- Use the same password: `qwer1234!`
- Sejong testnet(0x53)

### Account 1

```json
{
    "version": 3,
    "id": "71b29eef-d53f-4d39-bdee-ee0afe082c75",
    "address": "hx1747c0755e467d884dd617dfd3e02d804ff6ef2a",
    "crypto": {
        "ciphertext": "d7e966b8ee320c891ba4010a4b246660929617c84daeadcf9b4b206a236b59ae",
        "cipherparams": {
            "iv": "42e849cc412d62bed3faacff8fc39486"
        },
        "cipher": "aes-128-ctr",
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "salt": "524502f8f74e3ed9b3b11468b7ff32376f6d377da0008068793efc93d53aef7c",
            "n": 16384,
            "r": 8,
            "p": 1
        },
        "mac": "adcdc475697955e75db66bb44b9c96fc6b58054295d7d80e5b8dda7f29161c73"
    },
    "coinType": "icx"
}
```

### Account 2

```json
{
    "version": 3,
    "id": "775bb25f-b446-4a41-8688-c0b8b604cdd9",
    "address": "hxde14e6cff6e30bce177d0a84a9d72441d5194f45",
    "crypto": {
        "ciphertext": "97b581d6d206166591d946c8be6462c6a54bb666efb5e48b73ce349dc11e63df",
        "cipherparams": {
            "iv": "030a080cdef3b6e57fc8ccd033dfdd31"
        },
        "cipher": "aes-128-ctr",
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "salt": "4730d39bf7d00a228fb7b860a80add1645535b123371c5a5d58cc2dcde0062ef",
            "n": 16384,
            "r": 8,
            "p": 1
        },
        "mac": "cbd1c5bc495c68ab0c17062333224ce1797498b1ccfbc988179f9b1e02bd47b2"
    },
    "coinType": "icx"
}
```

