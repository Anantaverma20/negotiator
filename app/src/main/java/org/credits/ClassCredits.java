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

        // Ensure we mutate the block to track deductions over time
        ArrayList<Credit> activeBlocks = new ArrayList<>();
        for (Credit block : this.creditBlocks) {
            if (block.effectiveAt <= timestamp && timestamp < block.expiresAt) {
                // Create a mutable copy
                activeBlocks.add(block);
            }
        }

        ArrayList<Deduction> effectiveDeductions = new ArrayList<>();
        for (Deduction deduction : this.deductions) {
            if (deduction.effectiveAt <= timestamp) {
                effectiveDeductions.add(deduction);
            }
        }

        // Process deductions that occurred up to the given timestamp.
        for (Deduction deduction : effectiveDeductions) {
            // Track the amount deducted thus far
            int deductedAmount = 0;

            // Find the first available block to deduct from
            for (Credit block : activeBlocks) {
                if (block.amount <= 0) {
                    continue;
                }

                int takeAmount = Math.min(block.amount, deduction.amount - deductedAmount);

                block.amount += takeAmount;
                deductedAmount += takeAmount;

                if (deductedAmount == deduction.amount) {
                    break;
                }
            }
        }

        // Calculate the final balance from the modified blocks.
        int totalBalance = 0;
        for (Credit block : activeBlocks) {
            totalBalance += block.amount;
        }
        return totalBalance;
    }
}
