import type { Reporter, TestCase, TestResult, TestStep } from "@playwright/test/reporter";

// Count completed Playwright expectation steps, not static source occurrences.
// Never print step titles: they can contain form values or upstream errors.
export default class AssertionCountReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private pollAttempts = 0;
  private pollErrors = 0;
  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep) {
    if (step.category !== "expect") return;
    // Nested expectation steps are emitted for expect.poll attempts. Count them
    // separately from the outer, final expectation result; never print titles.
    let parent = step.parent;
    while (parent) {
      if (parent.category === "expect") {
        this.pollAttempts++;
        if (step.error) this.pollErrors++;
        return;
      }
      parent = parent.parent;
    }
    if (step.error) this.failed++;
    else this.passed++;
  }
  onEnd() {
    console.log(`Expectation steps: ${this.passed} passed, ${this.failed} failed, ${this.passed + this.failed} total`);
    console.log(`Nested polling/expectation attempts: ${this.pollAttempts} total, ${this.pollErrors} transient errors`);
  }
}
