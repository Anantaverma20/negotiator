package org.credits;

import java.util.*;

// ClassCredits manages a user's credit balance over time.
// This class is designed to handle credit additions and deductions where
// operations can be recorded out of order. It calculates the credit
// balance at any given point in time.
class ClassCredits {

    List<Credit> creditBlocks;
    List<Deduction> deductions;

    // CreditBlock represents a purchase of credits by a user.
    class Credit {

        int amount;
        int effectiveAt;
        int expiresAt;

        Credit(int amount, int effectiveAt, int expiresAt) {
            this.amount = amount;
            this.effectiveAt = effectiveAt;
            this.expiresAt = expiresAt;
        }
    }

    // Deduction represents a use of credits by a user for a class.
    class Deduction {

        int amount;
        int effectiveAt;

        Deduction(int amount, int effectiveAt) {
            this.amount = amount;
            this.effectiveAt = effectiveAt;
        }
    }

    // creates the comparator for comparing stock value
class CreditComparator implements Comparator<Credit> {

    // override the compare() method
    public int compare(Credit s1, Credit s2)
    {
        if (s1.effectiveAt == s2.effectiveAt)
            return s1.expiresAt - s2.expiresAt;
        else if (s1.effectiveAt > s2.effectiveAt)
            return 1;
        else
            return -1;
    }
}

    // creates the comparator for comparing stock value
class DeductionsComparator implements Comparator<Deduction> {

    // override the compare() method
    public int compare(Deduction s1, Deduction s2)
    {
        if (s1.effectiveAt == s2.effectiveAt)
            return 0;
        else if (s1.effectiveAt > s2.effectiveAt)
            return 1;
        else
            return -1;
    }
}

    ClassCredits() {
        this.creditBlocks = new ArrayList<>();
        this.deductions = new ArrayList<>();
    }

    // AddCredits adds a block of credits to the system.
    void AddCredits(int amount, int effectiveAt, int expiresAt) {
        Credit credit = new Credit(amount, effectiveAt, expiresAt);
        this.creditBlocks.add(credit);
    }

    // DeductCredits records a deduction of credits for a class.
    void DeductCredits(int amount, int effectiveAt) {
        Deduction deduction = new Deduction(amount, effectiveAt);
        this.deductions.add(deduction);
    }

    // GetBalanceAt calculates the total available credit balance at a specific timestamp.
    // This method accounts for all credit blocks and deductions that have
    // occurred up to the given timestamp. It is designed to deduct credits
    // from the soonest expiring blocks first.
    int GetBalanceAt(int timestamp) {
       // Same: Deep copy credits active at final timestamp
        List<Credit> allCredits = new ArrayList<>();
        for (Credit c : creditBlocks) {
            if (c.effectiveAt <= timestamp) {
                allCredits.add(new Credit(c.amount, c.effectiveAt, c.expiresAt));
            }
        }

        // NEW: Sort deductions by time
        List<Deduction> applicableDeductions = new ArrayList<>();
        for (Deduction d : deductions) {
            if (d.effectiveAt <= timestamp) {
                applicableDeductions.add(d);
            }
        }
        applicableDeductions.sort(Comparator.comparingInt(d -> d.effectiveAt));

        for(Credit c : allCredits){
                System.out.println("Initial Credit amount - "+c.amount+" starttime - "+c.effectiveAt+ " endtime - "+ c.expiresAt);
        }
        // CHANGED: Apply each deduction using credits valid at that time
        for (Deduction d : applicableDeductions) {
            int remaining = d.amount;

            // NEW: Filter credits valid at the time of this deduction
            List<Credit> eligibleCredits = new ArrayList<>();
            for (Credit c : allCredits) {
                if (c.effectiveAt <= d.effectiveAt && d.effectiveAt < c.expiresAt && c.amount > 0) {
                    eligibleCredits.add(c);
                }
            }

            // NEW: Sort eligible credits by expiration
            eligibleCredits.sort(Comparator
                .comparingInt((Credit c) -> c.expiresAt)
                .thenComparingInt(c -> c.effectiveAt));

            for(Credit c : eligibleCredits){
                System.out.println("Eligible Credit amount for Deduction - "+d.amount+" is "+c.amount+" starttime - "+c.effectiveAt+ " endtime - "+ c.expiresAt);
            }
            // CHANGED: Apply deduction only to eligible credits
            for (Credit c : eligibleCredits) {
                if (remaining == 0) break;
                int take = Math.min(c.amount, remaining);
                c.amount -= take;
                remaining -= take;
            }
        }
        for(Credit c : allCredits){
            System.out.println("Credit amount - "+c.amount+" starttime - "+c.effectiveAt+ " endtime - "+ c.expiresAt);
        }
        // Same: Sum remaining credits
        int balance = 0;
        for (Credit c : allCredits) { 
            if(c.expiresAt>timestamp){
             balance += c.amount;
            }
        }

        System.out.println("Balance is "+ balance);
        return balance;
    }
}
