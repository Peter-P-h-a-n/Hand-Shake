package com.score.handshake;

import score.Address;
import score.ObjectReader;
import score.ObjectWriter;

import java.math.BigInteger;

public class Contract {
    Address recruiter;
    Address employee;
    BigInteger salary;
    BigInteger depositAmount;
    BigInteger contractId;
    String status;

    public Contract() {}

    public Contract(Address recruiter, BigInteger salary, int contractId) {
        this.recruiter = recruiter;
        this.salary = salary;
        this.contractId = BigInteger.valueOf(contractId);
        this.status = "OPEN";
        this.employee = recruiter;
        this.depositAmount = BigInteger.ZERO;
    }

    public static void writeObject(ObjectWriter w, Contract contract) {
        w.beginList(6);
        w.write(contract.recruiter);
        w.write(contract.employee);
        w.write(contract.salary);
        w.write(contract.depositAmount);
        w.write(contract.contractId);
        w.write(contract.status);
        w.end();
    }

    public static Contract readObject(ObjectReader r) {
        Contract contract = new Contract();
        r.beginList();
        contract.recruiter = r.readAddress();
        contract.employee = r.readAddress();
        contract.salary = r.readBigInteger();
        contract.depositAmount = r.readBigInteger();
        contract.contractId = r.readBigInteger();
        contract.status = r.readString();
        r.end();
        return contract;
    }
}
