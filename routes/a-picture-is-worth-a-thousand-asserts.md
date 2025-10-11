---
{ "title": "Picture worth thousand asserts", "draft": true }
---
# A picture is worth a thousand asserts: Snapshot testing

I've always found automated testing for frontend tests incredibly frustrating.
Among the problems I've faced are:
- Test setup is incredibly complex and convoluted.
- Assertion failures are hard to interpret.
- The signal to noise ratio is bad (they break often, but not because there's a bug).
- They don't catch actual regressions.
- Most devs end up writing selectors based on test-id or class names, which are irrelevant to
  the actual user.

I've been using snapshot based playwright tests in my team for a while now and I find that
they solve a lot of these problems. Some of the solutions aren't because of the snapshot tests,
but just because of how I've structured the test harness.

## The promised land
What I want from my test suite.
- It should be easy to run locally. i.e. any service that the repository depends on should be faked in a realistic way.
- It should be easy to write new tests.
- Any test breakage should be reproducible in the actual app. i.e. if your test fails, there should be an actual bug.
- Refactors should not require break tests.
- It should be easy to interpret test failures.
- They should catch *actual* bugs.

All of these sound like reasonable goals, but in the real world test suites, I've never seen these to hold.
Developers aren't stupid. The reason they don't write tests (and are forced to write tests) is because they often
don't deliver value, because the above needs aren't met.

## How I've been testing
I've been using [Playwright](https://playwright.dev/) for testing. Instead of writing a lot of assertions,
I just set up a scenario (by some test harness APIs that I wrote for my app), then ask playwright to take a snapshot of the
actual browser window. This snapshot is committed to the repo. O

