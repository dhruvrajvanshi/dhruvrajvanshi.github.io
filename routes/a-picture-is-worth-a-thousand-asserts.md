---
{ "title": "Picture worth thousand asserts", "draft": true }
---
# A picture is worth a thousand asserts: Snapshot testing

I've always found automated testing for frontend incredibly frustrating. Test setup is complex.
Assertion failures are hard to understand. They fail when refactoring. They don't catch visual regressions.
It's difficult to translate bugs from prod into a test that fails.

I've been using snapshot based playwright tests in my team for a while now and I find that
they solve a lot of these problems.

## What this approach promises
- Tests are easy to run locally (`./bin/run-playwright.sh --ui`)
- It's easy to write tests.
- When the test breaks, you can see visually what's broken.
- You can paste each test's URL into a browser and debug it there.
- Refactors don't break tests.
- A small number of tests catch a lot of things which would have required a lot of assertions.
- Visual changes are reviewable in pull requests.

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

## Pain points
This approach still has a few downsides. For one, you need to invest a bit test infrastructure. This includes
your test case builder APIs. It's a massive temptation to set up test scenarios by using the same data structures
as your real app. However, it's really critical that you get as close to human language as possible.
Consider the following test helper which sets up a test app, which uses the exact same inputs as your "POST /boards"
endpoint.

```js
const board = await createBoard({
  slug: "WH",
  name: "Frontend engineering",
  settings: {
    notifications: {
      defaultNotificationChannels: ["Email", "App"]
      // ...
    },
    // ...
  },
  // ...
})
```
While the above works, it's riddled with a lot of details which don't really affect most tests. It can break
whenever you change the endpoint structure and it creates a lot of visual noise.
Instead, if you add a simpler api for creating boards, which come with sane defaults, the tests will not have
any of these problems.
```js
const boardResponse = await buildTestBoard(async (board) => {
  board.name = "Frontend engineering"
  // Other fields will default to a sensible state
  // you only have to initialize things which are relevant to this test
  // For example, if this test needs to check that you're enabling notifications
  board.enableInAppNotifications()
  board.disableEmailNotification()
})
```

Another issue is that you will need to maintain a "test" server which implements a fake, in-memory version
of your REST API. I want each test to call an actual API and go through the entire request/resposne flow
when playwright is running. Again, it's easy to just use mocks. However, mocks end up being brittle and
it nails down your internal APIs. You'd like your tests to be immune to internal refactors. They should
make sensible refactors cheap, not expensive.

A somewhat more technical issue is that your CI and local environment should use the same OS. In my team,
our CI runs Linux and we use MacOS, leading to subtle visual differences. So we actually save 2 versions of
screenshots in our git repo. Both can be generated locally using a single command `./bin/update-test-snapshots.sh`
which runs playwright in docker if it has to. Here are a few snippets which we use to simplify this process.

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
