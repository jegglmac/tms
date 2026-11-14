import type { Reporter, TestCase, TestResult, TestStep } from "@playwright/test/reporter";

// Count completed Playwright expectation steps, not static source occurrences.
// Never print step titles: they can contain form values or upstream errors.
export default class AssertionCountReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep) {
    if (step.category !== "expect") return;
    if (step.error) this.failed++;
    else this.passed++;
  }
  onEnd() {
    console.log(`Expectation steps: ${this.passed} passed, ${this.failed} failed, ${this.passed + this.failed} total`);
  }
}
