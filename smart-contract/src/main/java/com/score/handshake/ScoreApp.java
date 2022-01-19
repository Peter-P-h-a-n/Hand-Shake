package com.score.handshake;

import score.*;
import score.annotation.EventLog;
import score.annotation.External;
import score.annotation.Payable;

import java.math.BigInteger;

public class ScoreApp {
    private final String name;
    private final DictDB<BigInteger, Contract> hsContracts = Context.newDictDB("hs-contracts", Contract.class);

    private static final String OPEN = "OPEN"; //new contract
    private static final String LOCK = "LOCK"; //contract signed
    private int index = 0;
    private final BigInteger platformFee = BigInteger.ONE; //1%
    private final int recruiterFault = 1;
    private final int employeeFault = 2;

    public ScoreApp(String name) {
        this.name = name;
    }

    @External(readonly=true)
    public String name() {
        return name;
    }

    @External(readonly=true)
    public String getGreeting() {
        return "Hello " + name + "!";
    }

    @External
    @Payable
    public void createContract(int _contractId) {
        Contract contract = new Contract(Context.getCaller(), Context.getValue(), _contractId);
        BigInteger tId = BigInteger.valueOf(++index);
        hsContracts.set(tId, contract);
        CreateNewContract(Context.getCaller(), tId, BigInteger.valueOf(_contractId), Context.getValue());
    }

    @Payable
    @External
    public void signContract(BigInteger _id) {
        Contract contract = hsContracts.get(_id);
        BigInteger depositAmount = Context.getValue();
        Context.require(contract != null, "Contract not found");
        Context.require(contract.status.equals(OPEN), "Contract is not opened");
        Context.require(depositAmount.compareTo(BigInteger.ZERO) == 1, "Deposit amount invalid");
        contract.employee = Context.getCaller();
        contract.depositAmount = depositAmount;
        contract.status = LOCK;
        hsContracts.set(_id, contract);
        EmployeeSignContract(Context.getCaller(), _id, contract.contractId, depositAmount);
    }

    @External
    public void completeContract(BigInteger _id) {
        Contract contract = hsContracts.get(_id);
        Context.require(contract != null, "Contract not found");
        Context.require(contract.recruiter.equals(Context.getCaller()), "Contract owner only");
        BigInteger fee = contract.salary.divide(BigInteger.valueOf(100)).multiply(platformFee);
        ContractCompletion(contract.recruiter, _id, contract.contractId);
        //revert deposit amount
        Context.transfer(contract.employee, contract.depositAmount);
        //calculate platform fee
        //transfer salary for employee after subtract platform fee
        Context.transfer(contract.employee, contract.salary.subtract(fee));
    }

    @External
    public void unCompleteContract(BigInteger _id, int whoFault) {
        Contract contract = hsContracts.get(_id);
        Context.require(contract != null, "Contract not found");
        Context.require(Context.getOwner().equals(Context.getCaller()), "SC owner only");
        BigInteger feeSalary = contract.salary.divide(BigInteger.valueOf(100)).multiply(platformFee);
        BigInteger feeDeposit = contract.depositAmount.divide(BigInteger.valueOf(100)).multiply(platformFee);
        switch (whoFault) {
            case 1:
                //recruiter fault then send salary to employee, refund employee's deposit

                Context.transfer(contract.employee, contract.depositAmount);
                Context.transfer(contract.employee, contract.salary.subtract(feeSalary));
                Context.transfer(Context.getOwner(), feeSalary);
                UnCompleteContract(_id, BigInteger.ONE);
                break;
            case 2:
                //employee fault then send deposit to recruiter, refund recruiter's deposit
                Context.transfer(contract.recruiter, contract.salary);
                Context.transfer(contract.recruiter, contract.depositAmount.subtract(feeDeposit));
                Context.transfer(Context.getOwner(), feeDeposit);
                UnCompleteContract(_id, BigInteger.TWO);
                break;
            default:

                UnCompleteContract(_id, BigInteger.ZERO);
                break;
        }
    }

    @EventLog(indexed = 2)
    protected void CreateNewContract(Address recruiter, BigInteger id, BigInteger contactId, BigInteger salary) { }

    @EventLog(indexed = 2)
    protected void EmployeeSignContract(Address employee, BigInteger id, BigInteger contactId, BigInteger depositAmount) { }

    @EventLog(indexed = 2)
    protected void ContractCompletion(Address recruiter, BigInteger id, BigInteger contactId) { }

    @EventLog(indexed = 1)
    protected void UnCompleteContract(BigInteger id, BigInteger whoFault) {}

    @EventLog(indexed = 1)
    protected void LogT(String key, String value){}

}
