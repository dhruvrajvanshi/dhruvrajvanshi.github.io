---
{ "title": "Picture worth thousand asserts", "draft": true }
---
# A picture is worth a thousand asserts: Snapshot testing

Automated testing for frontend tests is incredibly frustrating.

- Test setup is complex.
- Assertion failures are hard to understand (jest/vitest just dumps the entire DOM tree in the console).
- They fail when refactoring.
- They don't catch visual regressions.

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
My tests look something like this

```ts
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
pull request diff. When a test fails, you can always re-run the test and open the page in the browser to debug it, all while
having the broken screenshot to visualize what actually went wrong from the user's POV.

Compare this to an average Jest/Vitest assertion failure when something goes wrong

```
// Example of a react-testing library assertion failure, which dumps a massive DOM snapshot

```
Yeah, no thanks.


## The rest of the owl
Just saying "Do snapshot tests" isn't really enough. There's a lot of test infrastructure investment that you need to do.
Here's a list
- Test harness APIs to set up various states in your app from a user's POV
    - e.g. Instead of `setupFrontendState({ some: { nested: object: { value: "Expected" }}})`, you should have
      actual user focused test helpers `placeOrder("BUY", "AAPL", 100)`.
- You need to create a fake version of your backend for tests. At least a subset of the APIs that you need
  to call in the tests. In my case, I had to implement about 10 HTTP endpoints, which read/write to in-memory `Map<ThingId, Thing>` objects.
  All of this is about 1000 lines of code (using fastify as the web server). It took a couple of weeks, spread over a few months between
  other work to set this up, and it still isn't complete. However, it started paying dividends within the first few days.
- Comparing snapshots can be tricky because of OS specific differences. Most likely, your CI runs on linux and your team uses mac os.
  This means, you'd need to run playwright in docker to update your test snapshots.
  - I commit both mac os and linux snapshots to the repo. Both are generated locally using a single command using docker.
    ```
    ./scripts/update-snapshots.sh
    # Optionally, you can pass other playwright arguments so that it only runs a subset of tests
    ./scripts/update-snapshots.sh -g "some test name"
    ```
   - There's a `./scripts/run-playwright-in-docker.sh` script which runs playwright in a docker container. This is used by the above script.
   ```

    docker run --name playwright-server-daemon -d \
        --add-host=hostmachine:host-gateway \
        -p 3000:3000 --rm --init -it \
        --workdir /home/pwuser \
        --user pwuser mcr.microsoft.com/playwright:v1.51.1-noble \
        /bin/sh -c "npx -y playwright@1.51.1 run-server --port 3000 --host 0.0.0.0"
    # Stop the docker container when done
    trap 'docker stop playwright-server-daemon' EXIT

    ATTEMPTS=5
    sleep 1
    while ! nc -z localhost 3000; do
        echo "Waiting for Playwright server to start..."
        sleep 1
        if [[ $ATTEMPTS -eq 0 ]]; then
            echo "Playwright server failed to start after multiple attempts."
            exit 1
        else
            ATTEMPTS=$((ATTEMPTS - 1))
        fi
    done

    echo "npx playwright test " "$@"
    PLAYWRIGHT_IN_DOCKER=true PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:3000/ \
        npx playwright test "$@"


   ```


