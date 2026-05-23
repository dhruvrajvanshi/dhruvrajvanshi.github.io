---
{ "draft": true }
---
# `throw`, don't `catch`
is a good rule of thumb that I like to follow when writing code.
Like all rules of thumb, you may want to break it occasionally, but the vast majority
of your code should follow this by default. I'd say 99% or possibly more
the lines of code that you write would be better off without the `catch` keyword.

## `throw` a lot
Throwing liberally helps with readibility. When you write something like this
```javascript
assert(someCondition);
```
You're clearly stating that the following code relies of someCondition being true.
In other words, the following code is free to be re-written with the assumption,
which often helps in simplifying and un-nesting the code.

## Throwing helps keep your stack trace clean.
For example, if you throw immediately, you're closer to the point in the call stack
where the bad assumption was violated.
If you don't throw here, a different and unexpected place will be chosen for you
by default. But that's likely not the code whose fault it is which led to `someCondition`
became false, because it happened much later.

## Don't `catch`.
If a specific error is meant to be caught by the immediate caller, returning an error code
is likely a better API because it communicates in the function signature that the failure
condition must be handled. I count Java's checked exceptions in the category of error codes,
because those are communicated in the function signature.

If you call a function that returns an error code and you don't have a sensible way to handle
it, just `throw`. That way the error is communicated to the top level "handler".

## But if you really have to `catch`
do it in your program's "main loop". A "catch all" block in the main loop may
convert exceptions into an HTTP status code, or a core dump, whichever makes sense.

It's important that you don't do too much logic based on the specific type of exception
that was thrown here. This is what programmers who hate this type of stuff call "hidden
control flow". Avoid it to avoid surprises.

## There may be exceptions
to this rule.
An API that you don't control may use exceptions to signal different types of
return values. You should catch these as close to the call site as possible.
Then, in the catch branch, either convert it into an error code structure that
makes sense.
