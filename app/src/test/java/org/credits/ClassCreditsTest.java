package org.credits;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ClassCreditsTest {

    private ClassCredits initializeClassCredits() {
        ClassCredits credits = new ClassCredits();
        return credits;
    }

    @Test
    void emptyState() {
        ClassCredits classCredits = initializeClassCredits();
        assertEquals(0, classCredits.GetBalanceAt(0));
    }

    @Test
    void getBalanceTest() {
        ClassCredits classCredits = initializeClassCredits();

        // We add one set of credits
        classCredits.AddCredits(11, 0, 5);

        // We add a deduction
        classCredits.DeductCredits(5, 1);

        assertEquals(6, classCredits.GetBalanceAt(2));
    }

    @Test
    void addThenDeduct() {
        ClassCredits classCredits = initializeClassCredits();

	    // We add one set of credits
	    classCredits.AddCredits(5, 0, 10);

	    // We deduct some credits
	    classCredits.DeductCredits(1, 5);

	    // Check the balance at a few different times
	    assertEquals(4, classCredits.GetBalanceAt(7));
	    assertEquals(4, classCredits.GetBalanceAt(8));
	    assertEquals(5, classCredits.GetBalanceAt(3));
    }

    @Test
    void mixedOrder() {
        ClassCredits classCredits = initializeClassCredits();

	    // Add a set of credits and a deduction
	    classCredits.AddCredits(5, 15, 23);
	    classCredits.DeductCredits(4, 17);

	    // Balance should be straightforward
	    assertEquals(1, classCredits.GetBalanceAt((20)));

	    // Add a new set of credits in the _past_ that should be used instead
	    classCredits.AddCredits(8, 3, 19);

	    // Balance should change
	    assertEquals(5, classCredits.GetBalanceAt((20)));
    }

    @Test
    void multipleBlocks() {
        ClassCredits classCredits = initializeClassCredits();

	    // We add two sets of credits:
	    // 1. Five credits active from (0, 10)
	    // 2. Six credits active from (1, 5)
	    classCredits.AddCredits(5, 0, 10);
	    classCredits.AddCredits(6, 1, 5);

	    assertEquals(11, classCredits.GetBalanceAt(2));

	    // Deduct four credits at time 3
	    classCredits.DeductCredits(4, 3);

	    // At time 4, we should have seven credits remaining
	    // since both of our blocks are active.
	    assertEquals(7, classCredits.GetBalanceAt(4));

	    // At time 6, we should have five credits remaining
	    // since one of the blocks expired.
	    assertEquals(5, classCredits.GetBalanceAt(6));
    }

    @Test
    void oldAndNew() {
        ClassCredits classCredits = initializeClassCredits();

	    // We add two sets of credits:
	    // 1. Five credits active from (0, 10)
	    // 2. Nine credits active from (15, 20)
	    classCredits.AddCredits(5, 0, 10);
	    classCredits.AddCredits(9, 15, 20);

	    assertEquals(5, classCredits.GetBalanceAt(2));

	    // Deduct some credits
	    classCredits.DeductCredits(5, 3);
	    assertEquals(0, classCredits.GetBalanceAt(4));

	    // Deduct some more credits
	    classCredits.DeductCredits(4, 16);
	    assertEquals(5, classCredits.GetBalanceAt(17));
    }

    @Test
    void multipleDeductions() {
        ClassCredits classCredits = initializeClassCredits();

	    // We add two sets of credits:
	    // 1. Eight credits active from (0, 10)
	    // 2. Six credits active from (5, 15)
	    classCredits.AddCredits(8, 0, 10);
	    classCredits.AddCredits(6, 5, 15);

	    assertEquals(8, classCredits.GetBalanceAt(2));

	    // Deduct some credits
	    classCredits.DeductCredits(5, 7);
	    assertEquals(9, classCredits.GetBalanceAt(8));

	    // Deduct some more credits in the past
	    classCredits.DeductCredits(4, 3);
	    assertEquals(5, classCredits.GetBalanceAt(13));
    }
}
