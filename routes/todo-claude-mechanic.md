---
{ "title": "// TODO(claude): Mechanize this" }
---

# // TODO(claude): Mechanize this

I've been using this technique for getting AI to do very mechanical
jobs without having to prompt super elaborately.


Place a comment like this in the file where it makes most sense.
```js
// TODO(claude): Describe your prompt succinctly.
//               Let it infer from local context
```

Place it close to the _this_, _thats_ and _those_ words you need in your prompt.

Then run claude and ask it to complete the TODO(claude) in @...fuzzy search your file name. Ask follow up questions if you think that the task is not super mechanical.

What I like about this approach is that I have to be less elaborate about my prompt,
and claude behaves less surprisingly. Usually, the source location of the prompt
really helps claude have "empathy" with the surrounding context, rather than trying
to play an architect.

Sometimes, I add an extra "Only look in these files @... and @..." to the prompt.
This is useful for when I really know that the task should be solvable with context from
these files. If not, claude will likely warn me thanks to the "ask follow up questions if ..."
bit in my prompt.

`/effort low` also helps for _really_ mechanical tasks.

That's all for today. Have a good one :)
