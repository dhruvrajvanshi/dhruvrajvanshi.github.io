---
{ "title": "The testing pyramid is wrong" }
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

```java
assert(getCancelledOrders().every(order -> order.isCancelled()))
```


