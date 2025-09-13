---
{ "title": "The testing pyramid is wrong", "draft": true }
---
# The testing pyramid is wrong

...for web apps.

It is [often](https://martinfowler.com/articles/practical-test-pyramid.html),
[suggested](https://circleci.com/blog/testing-pyramid/) that you should write
more "unit tests" and fewer "integration tests". I consider this to be absolutely
the wrong thing to do for *most* apps. You should be writing more intergration tests.

Of course, all advice is conditional
and there are absolutely cases where a lot of unit tests help. However, my
unfortunately contrarian advice is applicable to the the following types of
applications:
- REST APIs
- Web UIs
- CLI apps

## Tests make certain things resistant to change and that's good

When you write a test which validates an assumption, by definition, it breaks
when that assumption no longer holds.

```javascript
// getHomePageOrders() can't return non-recent orders anymore
// This fact is now harder to change without changing the test.
assert(getHomePageOrders().every(order -> order.isRecent()))
```

## Unit tests are often like nailing down the furniture in your house
While there's nothing to validate the fact that your house is still standing.

Here's an example of a "unit" test that I've seen in a lot of real codebases.
```javascript
when(orderRepository.getOrdersNewerThan(recencyThresholdDate))
    .return([testOrder1, testOrder2]);
assert(orderService.getRecentOrders().equals([testOrder1, testOrder2]))

```

This test has nailed down these facts
1. There's a service called `orderService`.
2. There's a service called `orderRepository`.
3. `OrderService.getRecentOrders()` calls `OrderRepository.getOrdersNewerThan(date)`.

You've clearly made it harder to break the above assumptions.
What did you get in return? Uhh...Very little 😕.

You actually haven't tested the fact that the home page should show recent orders.
The `getOrdersNewerThan` is free to ignore your `date` argument and the test will
still pass.

To make this more complete, you'd need to "unit" test `OrderRepository` too.
On the other hand, if you ever wanted to break apart the `OrderRepository` into
multiple classes because it's become quite large, you'd have to change both of
these tests.

*Congratulations! You've nailed down stuff that doesn't matter*


## What you should have done instead

Consider this instead

```javascript
const ALL_ORDERS = [
    FakeOrder.withDate(today),
    FakeOrder.withDate(yesterday),
    FakeOrder.withDate(sixMonthsAgo),
]
orderRepository.createOrders()

expect(
    orderService.getRecentOrders()
).equals(ALL_ORDERS.filter(it => dateMinus()))
```

This is slightly better because the test doesn't foce `orderService` to
call a specific method on `orderRepository`. It's free to call a different method.
You're free to change the `orderRepository` interface.

Good?

What I'd actually do is go one level higher.

```javascript
testHarness.setCurrentDate(twoMonthsAgo)
testHarness.request("POST /orders", [
    { security: "FAS", amount: "4" },
    { security: "BLZ", amount: "-6" }
])
testHarness.setCurentDate(twentyDaysAgo)
testHarness.request("POST /orders", [
    { security: "XYZ", amount: "5" },
    { security: "FOOBAR", amount: "7" }
])
expect(
    testHarness.request("GET /dashboard/orders")).equals([
        { security: "XYZ", amount: "5" },
        { security: "FOOBAR", amount: "7" }
    ]
))
```

Now, you're starting to speak the language of your consumers.
All they care about is the fact that these API endpoints exist
and they return the correct data.

## The rest of the owl

Clearly, I've handwaved a lot of potential complexity behind the magical
`testHarness`. And yeah, that's the hard part.
For this to work, you need a harness which makes it easy to write tests.
This would set up your server (possibly a fake, in-memory server engine, possibly not),
set up your database (possibly a docker container, or maybe something else).

If you use DI containers, then it would set up your application context.
This might not be a small amount of code. But I reckon, neither are your unit tests.
