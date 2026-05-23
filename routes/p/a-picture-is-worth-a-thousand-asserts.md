---
{ "title": "Picture worth thousand asserts", "draft": true }
---
# A picture is worth a thousand asserts: Snapshot testing

I've always found automated testing for frontend incredibly frustrating. Test setup is complex.
Assertion failures are hard to understand. They fail when refactoring. They don't catch visual regressions.
It's difficult to translate bugs from prod into a test that fails.

I've been using snapshot based playwright tests in my team for a while now and I find that
they solve a lot of these problems.

## My guiding principles for frontend tests
- Tests should be easy to run locally with a single command.
- It should be easy to write tests.
- When the test breaks, you should be able to see visually what's broken. You should also be able to open any test app
in any browser.
- Refactors shouldn't break tests.
- Visual changes should be reviewable in pull requests.

## How I test
I've been using [Playwright](https://playwright.dev/) for testing.
Here's an adapted version of an actual test which I wrote.
This test verifies that clicking a table's header 3 times is a no-op.
It was a real bug we saw in prod because of weird interactions between
an internal API and @tanstack/react-query.

```js
test("Clicking on the sort button 3 times should take the table back to the initial state", async ({ page }) => {
  const app = await buildTestApp(async app => {
    await app.addTickets(
      ["PT-1213", "Create a test server using fastify", "DONE"],
      ["PT-1242", "Add GET /tickets endpoint", "DONE"],
      ["PT-3421", "Add POST /tickets endpoint", "IN_PROGRESS"],
      ["PT-3214", "A buildTestApp API which calls fetch('GET /tickets') and fetch('POST /tickets') to set up a test app", "NOT_STARTED"],
    )
  })
  await page.goto(`${app.baseUrl}/tickets?view=table`)

  // Sort ascending
  await page.getByText("Slug").click()
  await expect(page.getByRole("progressbar")).toBeInViewport()
  await expect(page.getByRole("progressbar")).not.toBeInViewport()

  await expect(page).toHaveScreenshot("header-triple-click-test.png")

  // Sort descending
  await page.getByText("Slug").click()
  await expect(page.getByRole("progressbar")).toBeInViewport()
  await expect(page.getByRole("progressbar")).not.toBeInViewport()

  // Reset sort
  await page.getByText("Slug").click()
  await expect(page.getByRole("progressbar")).toBeInViewport()
  await expect(page.getByRole("progressbar")).not.toBeInViewport()
  // Same screenshot name. Clicking it 3 times should look exactly the same as clicking no times
  await expect(page).toHaveScreenshot("header-triple-click-test.png")
})
```
Not only will it catch the bug, it will likely fail in the same way as it does in prod with a visual difference
showing that the sort is wrong. As a bonus, this test also has a lot of "hidden" assertions like how the screen
looks. This is something that you can't practically test with just assertions. This leads me to write
either smoke tests or test for a bug which I've caught.

## TODO

## FAQ
> Are you saying you don't need unit tests?

No. Pure functions are really best tested in unit tests. This is a really quick way to test a lot of complex
logic which is behind a stable and pure API.

> Doesn't your test suite take a lot of time?

- Per test, kind of, but we got rid of a lot of tests so overall, our playwright suite runs quicker than our old
  vitest based suite.
- It's also very trivial to parallelize. Our pull request CI currently takes about 3 minutes.
- It's trivial to run one test at a time. I usually have a playwright ui open which is automatically re-running
  the test that I'm focused on.

> Don't you find flakiness in the snapshots?

Yes, but surprisingly not a lot. Most of the times, it comes from taking a screenshot too early when certain
parts of the UI haven't loaded. But since we've put most of our external interactions into the fake server,
such cases mainly come up only for images. We **do** have to occasionally put `waitForImageToLoad(someImage)`
to fix this.

> Has it caught actual bugs?

Yes. In the last few months, it's prevented me from shipping about a dozen bugs.

> What about OS level differen
